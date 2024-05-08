using System.Security.Claims;
using System.Text.Json;
using Application.Layers.Identity;
using Application.Layers.MessageQueues.UserRegistered;
using Application.Layers.MessageQueues.VerificationEmailSend;
using Application.Layers.Redis;
using Domain.Common;
using Domain.DTOs.Authorization;
using Domain.Exceptions;
using Identity.Common;
using Identity.Entities;
using Identity.Helpers;
using Identity.Interfaces;

namespace Identity.Services;

public class AuthorizationService: IAuthorizationService
{
    private readonly IRedisService _redisService;
    private readonly IVerificationEmailSendProducer _verificationEmailSendProducer;
    private readonly IUserRegisteredProducer _userRegisteredProducer;
    private readonly ITokenService _tokenService;
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IIdentityTokenRepository _tokenRepository;
    private readonly IIdentityUnitOfWork _identityUnitOfWork;
    
    public AuthorizationService(IRedisService redisService, 
        IVerificationEmailSendProducer verificationEmailSendProducer, 
        ITokenService tokenService, 
        IIdentityUserRepository identityUserRepository,
        IUserRegisteredProducer userRegisteredProducer, 
        IIdentityUnitOfWork identityUnitOfWork, 
        IIdentityTokenRepository tokenRepository)
    {
        _redisService = redisService;
        _verificationEmailSendProducer = verificationEmailSendProducer;
        _tokenService = tokenService;
        _identityUserRepository = identityUserRepository;
        _userRegisteredProducer = userRegisteredProducer;
        _identityUnitOfWork = identityUnitOfWork;
        _tokenRepository = tokenRepository;
    }
    
    public async Task<string> SendEmailVerificationCodeAsync(string email)
    {
         var verificationCode = VerificationCode.GenerateVerificationCode();
         var sessionId = Guid.NewGuid().ToString();
         
         var verifyMailSession = new SessionVerifyEmail
         {
             Email = email,
             VerificationCode = verificationCode,
             IsOk = false
         };
         
         var isAdded = await _redisService
             .SetValueAsync(sessionId,verifyMailSession.ToString(),TimeSpan.FromMinutes(5));

         if (!isAdded)
         {
             throw new Exception($"Сессия не создана {sessionId}");
         }

         await _verificationEmailSendProducer.PublishEmailSend(new VerificationEmailSendEvent(
             email,
             confirmLink:"",
             verificationCode));

         return sessionId;
    }

    public async Task<string> ResendVerificationCodeAsync(string sessionId,string email)
    {
        var sessionJson = await _redisService.GetValueAsync(sessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия не найдена");
        }
        
        var verificationCode = VerificationCode.GenerateVerificationCode();

        var newSession = new SessionVerifyEmail
        {
            Email = email,
            VerificationCode = verificationCode,
            IsOk = false
        };

        var isUpdate = await _redisService.UpdateValueAsync(
            sessionId, 
            newSession.ToString(), 
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
        
        await _verificationEmailSendProducer.PublishEmailSend(new VerificationEmailSendEvent(email,
            confirmLink:"",
            verificationCode));

        return sessionId;
    }

    public async Task VerifyEmailCodeAsync(string sessionId,string verifyCode)
    {
        var sessionValue = await _redisService.GetValueAsync(sessionId);

        if (sessionValue is null)
        {
            throw new SessionCodeNotFoundException("Сессия закончилась");
        }

        var sessionVerifyEmail = JsonSerializer.Deserialize<SessionVerifyEmail>(sessionValue);

        if (verifyCode != sessionVerifyEmail!.VerificationCode)
        {
            throw new SessionCodeNotValidException("Неправильный код верификации");
        }
        
        sessionVerifyEmail.IsOk = true;

        var isUpdate = await _redisService.UpdateValueAsync(
            sessionId,
            sessionVerifyEmail.ToString(),
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
    }

    public async Task<RegistrationResponse> RegisterUserAsync(RegistrationRequest registrationRequest)
    {
        var sessionJson = await _redisService.GetValueAsync(registrationRequest.SessionId);

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

        string accessToken = null!, refreshToken = null!;
        await _identityUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            var identityUser = await _identityUserRepository.AddUserAsync(newIdentityUser);
        
            await _userRegisteredProducer.PublishUserRegistered(new UserRegisteredEvent(
                identityUser.Id,
                registrationRequest.UserName
            ));
        
             accessToken = _tokenService.GenerateAccessToken(identityUser);
             refreshToken = await _tokenService.GenerateRefreshTokenAsync(
                 identityUser.Id,
                 registrationRequest.IpAddress,
                 registrationRequest.DeviceName);

            await _redisService.DeleteValueAsync(registrationRequest.SessionId);
        });

        return new RegistrationResponse(accessToken, refreshToken);
    }

    public async Task<LoginResponse> LoginUserAsync(LoginRequest loginRequest)
    {
        var identityUser = await _identityUserRepository.GetUserByEmailAsync(loginRequest.Email);

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
                ? await _tokenService.GenerateRefreshTokenAsync(identityUser.Id, loginRequest.IpAddress, loginRequest.DeviceName)
                : await _tokenService.UpdateRefreshTokenAsync(identityUser.Id,loginRequest.IpAddress);
            
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
            var identityUser = await _identityUserRepository.GetUserByIdAsync(userId);
            
            accessToken = _tokenService.GenerateAccessToken(identityUser!);
            refreshToken = await _tokenService.UpdateRefreshTokenAsync(identityUser!.Id,refreshTokenRequest.IpAddress);
        });

        return new RefreshTokenResponse(accessToken, refreshToken);
    }
}