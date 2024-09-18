using System.Security.Claims;
using System.Text.Json;
using Application.Layers.Identity;
using Application.Layers.Identity.Models.Authorization;
using Application.Layers.MessageQueues.SendCodeToConfirmEmail;
using Application.Layers.MessageQueues.UserRegistered;
using Application.Layers.Redis;
using Domain.Common;
using Domain.Exceptions;
using Identity.Common;
using Identity.Entities;
using Identity.Helpers;
using Identity.Interfaces;

namespace Identity.Services;

public class AuthorizationService: IAuthorizationService
{
    private readonly IRedisService _redisService;
    private readonly ISendCodeToConfirmEmailProducer _sendCodeToConfirmEmailProducer;
    private readonly IUserRegisteredProducer _userRegisteredProducer;
    private readonly ITokenService _tokenService;
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IIdentityTokenRepository _tokenRepository;
    private readonly IIdentityUnitOfWork _identityUnitOfWork;
    
    public AuthorizationService(IRedisService redisService, 
        ISendCodeToConfirmEmailProducer sendCodeToConfirmEmailProducer, 
        ITokenService tokenService, 
        IIdentityUserRepository identityUserRepository,
        IUserRegisteredProducer userRegisteredProducer, 
        IIdentityUnitOfWork identityUnitOfWork, 
        IIdentityTokenRepository tokenRepository)
    {
        _redisService = redisService;
        _sendCodeToConfirmEmailProducer = sendCodeToConfirmEmailProducer;
        _tokenService = tokenService;
        _identityUserRepository = identityUserRepository;
        _userRegisteredProducer = userRegisteredProducer;
        _identityUnitOfWork = identityUnitOfWork;
        _tokenRepository = tokenRepository;
    }
    
    public async Task<RegistrationResponse> RegisterUser(RegistrationRequest registrationRequest)
    {
        var sessionJson = await _redisService.GetValue(registrationRequest.SessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия подтверждения закончилась, повторите попытку");
        }

        var session = JsonSerializer.Deserialize<SessionVerifyEmail>(sessionJson);

        if (session is null || !session.IsOk)
        {
            throw new SessionCodeNotValidException("Сессия не подтверждена");
        }

        var newIdentityUser = new IdentityUser
        {
            Email = session.Email,
            EmailConfirmed = true,
            DateCreated = DateTime.Now,
            PasswordHash = ComputeHash256.ComputeSha256Hash(registrationRequest.Password)
        };

        string accessToken = string.Empty, refreshToken = string.Empty;
        await _identityUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            var identityUser = await _identityUserRepository.AddUser(newIdentityUser);
        
            await _userRegisteredProducer.PublishUserRegistered(new UserRegisteredEvent(
                identityUser.Id,
                registrationRequest.UserName
            ));
        
            accessToken = _tokenService.GenerateAccessToken(identityUser);
            refreshToken = await _tokenService.GenerateRefreshToken(
                 identityUser.Id,
                 registrationRequest.IpAddress,
                 registrationRequest.DeviceName);

            await _redisService.DeleteValue(registrationRequest.SessionId);
        });

        return new RegistrationResponse(accessToken, refreshToken);
    }

    public async Task<LoginResponse> LoginUser(LoginRequest loginRequest)
    {
        var identityUser = await _identityUserRepository.GetUserByEmail(loginRequest.Email);

        if (identityUser is null)
        {
            throw new AuthenticationValidException("Email","Пользователь с такой почтой не зарегестрирован");
        }
        
        if (identityUser.PasswordHash != ComputeHash256.ComputeSha256Hash(loginRequest.Password))
        {
            throw new AuthenticationValidException("Password","Неправильный пароль");
        }
        
        string accessToken = null!, refreshToken = null!;

        await _identityUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            var identityToken = await _tokenRepository
                .GetTokenByUserAndIpAddress(identityUser.Id, loginRequest.IpAddress);

            refreshToken = identityToken is null
                ? await _tokenService.GenerateRefreshToken(identityUser.Id, loginRequest.IpAddress, loginRequest.DeviceName)
                : await _tokenService.UpdateRefreshToken(identityUser.Id,loginRequest.IpAddress);
            
            accessToken = _tokenService.GenerateAccessToken(identityUser);
            
        });
        
        return new LoginResponse(accessToken, refreshToken);
    }

    public async Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest refreshTokenRequest)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(refreshTokenRequest.AccessToken);

        var userId = long.Parse(principal.Claims.First(p => p.Type == ClaimTypes.NameIdentifier).Value);
        var identityToken = await _tokenRepository.GetTokenByUserAndIpAddress(userId,refreshTokenRequest.IpAddress);

        if (identityToken is null || identityToken.Token != refreshTokenRequest.RefreshToken
            || identityToken.Expiration <= DateTime.Now)
        {
            throw new AuthenticationValidException("Token", "Недействительный токен обновления");
        }
        
        string accessToken = null!, refreshToken = null!;

        await _identityUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            var identityUser = await _identityUserRepository.GetUserById(userId);
            
            accessToken = _tokenService.GenerateAccessToken(identityUser);
            refreshToken = await _tokenService.UpdateRefreshToken(identityUser.Id,refreshTokenRequest.IpAddress);
        });

        return new RefreshTokenResponse(accessToken, refreshToken);
    }
}