using System.Text.Json;
using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using Application.Layers.MessageQueues.ResetPasswordCode;
using Application.Layers.Redis;
using Domain.Common;
using Domain.DTOs.Authorization;
using Domain.DTOs.User;
using Domain.Exceptions;
using Identity.Common;
using Identity.Helpers;
using Identity.Interfaces;

namespace Identity.Services;

public class UserService: IUserService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IIdentityTokenRepository _identityTokenRepository;
    private readonly IRedisService _redisService;
    private readonly ISendResetPasswordCodeProducer _sendResetPasswordCodeProducer;
    private readonly IIdentityUnitOfWork _identityUnitOfWork;
    
    public UserService(IIdentityUserRepository identityUserRepository, 
        IIdentityTokenRepository identityTokenRepository, 
        IRedisService redisService, 
        ISendResetPasswordCodeProducer sendResetPasswordCodeProducer, 
        IIdentityUnitOfWork identityUnitOfWork)
    {
        _identityUserRepository = identityUserRepository;
        _identityTokenRepository = identityTokenRepository;
        _redisService = redisService;
        _sendResetPasswordCodeProducer = sendResetPasswordCodeProducer;
        _identityUnitOfWork = identityUnitOfWork;
    }

    public async Task<UserInformation> GetUserInformation(long userId)
    {
        var identityUser = await _identityUserRepository.GetUserByIdAsync(userId);

        return new UserInformation
        {
            UserId = identityUser.Id,
            Email = identityUser.Email,
            DateCreated = identityUser.DateCreated,
            EmailConfirmed = identityUser.EmailConfirmed,
            PhoneNumber = identityUser.PhoneNumber,
            TwoFactorEnabled = identityUser.TwoFactorEnabled
        };
    }

    public async Task UpdatePassword(UpdatePasswordRequest updatePasswordRequest)
    {
        var identityUser = await _identityUserRepository.GetUserByIdAsync(updatePasswordRequest.UserId);
        var sessionJson = await _redisService.GetValueAsync(updatePasswordRequest.SessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия подтверждения закончилась, повторите попытку");
        }

        var session = JsonSerializer.Deserialize<SessionResetPassword>(sessionJson);

        if (session is null || !session.IsOk)
        {
            throw new SessionCodeNotValidException("Сессия не подтверждена");
        }
        
        if (identityUser.PasswordHash != ComputeHash256.ComputeSha256Hash(updatePasswordRequest.PreviousPassword))
        {
            throw new AuthenticationValidException("PreviousPassword","Неправильный пароль");
        }
        
        var newPasswordHash = ComputeHash256.ComputeSha256Hash(updatePasswordRequest.NewPassword);

        identityUser.PasswordHash = newPasswordHash;

        await _identityUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            await _identityUserRepository.UpdateUserAsync(identityUser);
            await _identityTokenRepository.DeleteTokensByUserIdAsync(identityUser.Id);
        });
    }

    public async Task<string> SendCodeResetPassword(long userId)
    {
        var verificationCode = VerificationCode.GenerateVerificationCode();
        var sessionId = Guid.NewGuid().ToString();

        var user = await _identityUserRepository.GetUserByIdAsync(userId);
        
        var verifySessionResetPassword = new SessionResetPassword
        {
            UserId = userId,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isAdded = await _redisService.SetValueAsync(
            sessionId,
            verifySessionResetPassword.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isAdded)
        {
            throw new Exception($"Сессия не создана {sessionId}");
        }
        
        await _sendResetPasswordCodeProducer.PublishEmailSend(new SendResetPasswordCodeEvent(
            user.Email,
            verificationCode));

        return sessionId;

    }

    public async Task VerifyResetPasswordCode(string sessionId, string verifyCode)
    {
        var sessionValue = await _redisService.GetValueAsync(sessionId);
        
        if (sessionValue is null)
        {
            throw new SessionCodeNotFoundException("Сессия закончилась");
        }
        
        var sesssionResetPassword = JsonSerializer.Deserialize<SessionResetPassword>(sessionValue);
        
        if (verifyCode != sesssionResetPassword?.VerificationCode)
        {
            throw new SessionCodeNotValidException("Неправильный код верификации");
        }

        sesssionResetPassword.IsOk = true;
        
        var isUpdate = await _redisService.UpdateValueAsync(
            sessionId,
            sesssionResetPassword.ToString(),
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
    }

    public async Task<string> ResendResetPasswordCode(string sessionId, long userId)
    {
        var sessionJson = await _redisService.GetValueAsync(sessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия не найдена");
        }

        var user = await _identityUserRepository.GetUserByIdAsync(userId);
        
        var verificationCode = VerificationCode.GenerateVerificationCode();

        var newSession = new SessionResetPassword
        {
            UserId = userId,
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
        
        await _sendResetPasswordCodeProducer.PublishEmailSend(new SendResetPasswordCodeEvent(
            user.Email, verificationCode));

        return sessionId;
    }
}