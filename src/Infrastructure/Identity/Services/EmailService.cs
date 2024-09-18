using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.RegularExpressions;
using Application.Layers.Identity;
using Application.Layers.MessageQueues.SendCodeToChangeEmail;
using Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;
using Application.Layers.MessageQueues.SendCodeToResetPassword;
using Application.Layers.Redis;
using Domain.Exceptions;
using Identity.Common;
using Identity.Helpers;
using Identity.Interfaces;

namespace Identity.Services;

[SuppressMessage("GeneratedRegex", "SYSLIB1045:Преобразовать в \"GeneratedRegexAttribute\".")]
public class EmailService: IEmailService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IRedisService _redisService;
    private readonly ISendCodeToResetPasswordProducer _sendCodeToResetPasswordProducer;
    private readonly ISendCodeToChangeEmailProducer _sendCodeToChangeEmailProducer;
    private readonly ISendCodeToConfirmNewEmailProducer _sendCodeToConfirmNewEmailProducer;

    public EmailService(IIdentityUserRepository identityUserRepository, 
        ISendCodeToResetPasswordProducer sendCodeToResetPasswordProducer, 
        ISendCodeToChangeEmailProducer sendCodeToChangeEmailProducer, 
        IRedisService redisService, 
        ISendCodeToConfirmNewEmailProducer sendCodeToConfirmNewEmailProducer)
    {
        _identityUserRepository = identityUserRepository;
        _sendCodeToResetPasswordProducer = sendCodeToResetPasswordProducer;
        _sendCodeToChangeEmailProducer = sendCodeToChangeEmailProducer;
        _redisService = redisService;
        _sendCodeToConfirmNewEmailProducer = sendCodeToConfirmNewEmailProducer;
    }

    public async Task<bool> ContainEmailAsync(string email)
    {
        var user = await _identityUserRepository.GetUserByEmail(email);

        return user is not null;
    }

    public bool ValidationEmail(string email)
    {
        var regex = 
            new Regex(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$");
        
        return regex.IsMatch(email);
    }
    
     public async Task<string> SendCodeResetPassword(long userId)
    {
        var verificationCode = VerificationCode.GenerateVerificationCode();
        var sessionId = Guid.NewGuid().ToString();

        var user = await _identityUserRepository.GetUserById(userId);
        
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
        
        await _sendCodeToResetPasswordProducer.PublishEmailSend(new SendCodeToResetPasswordEvent(
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

        var user = await _identityUserRepository.GetUserById(userId);
        
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
        
        await _sendCodeToResetPasswordProducer.PublishEmailSend(new SendCodeToResetPasswordEvent(
            user.Email, verificationCode));

        return sessionId;
    }

    public async Task<string> SendCodeToChangeEmail(long userId)
    {
        var verificationCode = VerificationCode.GenerateVerificationCode();
        var sessionId = Guid.NewGuid().ToString();

        var user = await _identityUserRepository.GetUserById(userId);
        
        var sessionChangeEmail = new SessionVerifyEmail()
        {
            Email = user.Email,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isAdded = await _redisService.SetValueAsync(
            sessionId,
            sessionChangeEmail.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isAdded)
        {
            throw new Exception($"Сессия не создана {sessionId}");
        }
        
        await _sendCodeToChangeEmailProducer.PublishEmailSend(new SendCodeToChangeEmailEvent(
            user.Email,
            verificationCode));

        return sessionId;
    }

    public async Task<string> ResendCodeToChangeEmail(string sessionId, long userId)
    {
        var sessionJson = await _redisService.GetValueAsync(sessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия не найдена");
        }

        var user = await _identityUserRepository.GetUserById(userId);
        
        var verificationCode = VerificationCode.GenerateVerificationCode();
        
        var sessionChangeEmail = new SessionVerifyEmail
        {
            Email = user.Email,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isUpdated = await _redisService.UpdateValueAsync(
            sessionId,
            sessionChangeEmail.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isUpdated)
        {
            throw new Exception($"Сессия не создана {sessionId}");
        }
        
        await _sendCodeToChangeEmailProducer.PublishEmailSend(new SendCodeToChangeEmailEvent(
            user.Email,
            verificationCode));

        return sessionId;
    }

    public async Task VerifyCodeToChangeEmail(string sessionId, string verifyCode)
    {
        var sessionValue = await _redisService.GetValueAsync(sessionId);
        
        if (sessionValue is null)
        {
            throw new SessionCodeNotFoundException("Сессия закончилась");
        }
        
        var sessionVerifyEmail = JsonSerializer.Deserialize<SessionVerifyEmail>(sessionValue);
        
        if (verifyCode != sessionVerifyEmail?.VerificationCode)
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

    public async Task<string> SendCodeToConfirmNewEmail(string newEmail)
    {
        var verificationCode = VerificationCode.GenerateVerificationCode();
        var sessionId = Guid.NewGuid().ToString();
        
        var sessionChangeEmail = new SessionVerifyEmail
        {
            Email = newEmail,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isAdded = await _redisService.SetValueAsync(
            sessionId,
            sessionChangeEmail.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isAdded)
        {
            throw new Exception($"Сессия не создана {sessionId}");
        }
        
        await _sendCodeToConfirmNewEmailProducer.PublishEmailSend(new SendCodeToConfirmNewEmailEvent(
            newEmail,
            verificationCode));

        return sessionId;
    }

    public async Task<string> ResendCodeToConfirmNewEmail(string sessionId, string newEmail)
    {
        var sessionJson = await _redisService.GetValueAsync(sessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия не найдена");
        }
        
        var verificationCode = VerificationCode.GenerateVerificationCode();
        
        var sessionChangeEmail = new SessionVerifyEmail
        {
            Email = newEmail,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isUpdated = await _redisService.UpdateValueAsync(
            sessionId,
            sessionChangeEmail.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isUpdated)
        {
            throw new Exception($"Сессия не создана {sessionId}");
        }
        
        await _sendCodeToConfirmNewEmailProducer.PublishEmailSend(new SendCodeToConfirmNewEmailEvent(
            newEmail,
            verificationCode));

        return sessionId;
    }
    
    public async Task VerifyCodeToConfirmNewEmail(string sessionId, string verifyCode)
    {
        var sessionValue = await _redisService.GetValueAsync(sessionId);
        
        if (sessionValue is null)
        {
            throw new SessionCodeNotFoundException("Сессия закончилась");
        }
        
        var sessionVerifyEmail = JsonSerializer.Deserialize<SessionVerifyEmail>(sessionValue);
        
        if (verifyCode != sessionVerifyEmail?.VerificationCode)
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
}