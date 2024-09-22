using System.Text.Json;
using Application.Layers.Identity;
using Application.Layers.MessageQueues.SendCodeToChangeEmail;
using Application.Layers.MessageQueues.SendCodeToConfirmEmail;
using Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;
using Application.Layers.MessageQueues.SendCodeToUpdatePassword;
using Application.Layers.Redis;
using Domain.Exceptions;
using Identity.Common;
using Identity.Helpers;
using Identity.Interfaces;

namespace Identity.Services;

public class VerificationService: IVerificationService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IRedisService _redisService;
    private readonly ISendCodeToUpdatePasswordProducer _sendCodeToUpdatePasswordProducer;
    private readonly ISendCodeToChangeEmailProducer _sendCodeToChangeEmailProducer;
    private readonly ISendCodeToConfirmNewEmailProducer _sendCodeToConfirmNewEmailProducer;
    private readonly ISendCodeToConfirmEmailProducer _sendCodeToConfirmEmailProducer;

    public VerificationService(IIdentityUserRepository identityUserRepository, 
        IRedisService redisService, 
        ISendCodeToUpdatePasswordProducer sendCodeToUpdatePasswordProducer,
        ISendCodeToChangeEmailProducer sendCodeToChangeEmailProducer, 
        ISendCodeToConfirmNewEmailProducer sendCodeToConfirmNewEmailProducer, 
        ISendCodeToConfirmEmailProducer sendCodeToConfirmEmailProducer)
    {
        _identityUserRepository = identityUserRepository;
        _redisService = redisService;
        _sendCodeToUpdatePasswordProducer = sendCodeToUpdatePasswordProducer;
        _sendCodeToChangeEmailProducer = sendCodeToChangeEmailProducer;
        _sendCodeToConfirmNewEmailProducer = sendCodeToConfirmNewEmailProducer;
        _sendCodeToConfirmEmailProducer = sendCodeToConfirmEmailProducer;
    }
    
    public async Task<string> SendCodeToConfirmEmail(string email)
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
             .SetValue(sessionId,verifyMailSession.ToString(),TimeSpan.FromMinutes(5));

         if (!isAdded)
         {
             throw new Exception($"Сессия не создана {sessionId}");
         }

         await _sendCodeToConfirmEmailProducer.PublishEmailSend(new SendCodeToConfirmEmailEvent(
             email,
             confirmLink:"",
             verificationCode));

         return sessionId;
    }

    public async Task<string> ResendCodeToConfirmEmail(string sessionId,string email)
    {
        var sessionJson = await _redisService.GetValue(sessionId);

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

        var isUpdate = await _redisService.UpdateValue(
            sessionId, 
            newSession.ToString(), 
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
        
        await _sendCodeToConfirmEmailProducer.PublishEmailSend(new SendCodeToConfirmEmailEvent(email,
            confirmLink:"",
            verificationCode));

        return sessionId;
    }

    public async Task VerifyCodeToConfirmEmail(string sessionId,string verifyCode)
    {
        var sessionValue = await _redisService.GetValue(sessionId);

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

        var isUpdate = await _redisService.UpdateValue(
            sessionId,
            sessionVerifyEmail.ToString(),
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
    }
    

    public async Task<string> SendCodeToUpdatePassword(long userId)
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
        
        var isAdded = await _redisService.SetValue(
            sessionId,
            verifySessionResetPassword.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isAdded)
        {
            throw new Exception($"Сессия не создана {sessionId}");
        }
        
        await _sendCodeToUpdatePasswordProducer.PublishEmailSend(new SendCodeToUpdatePasswordEvent(
            user.Email,
            verificationCode));

        return sessionId;

    }

    public async Task VerifyCodeToUpdatePassword(string sessionId, string verifyCode)
    {
        var sessionValue = await _redisService.GetValue(sessionId);
        
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
        
        var isUpdate = await _redisService.UpdateValue(
            sessionId,
            sesssionResetPassword.ToString(),
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
    }

    public async Task<string> ResendCodeToUpdatePassword(string sessionId, long userId)
    {
        var sessionJson = await _redisService.GetValue(sessionId);

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

        var isUpdate = await _redisService.UpdateValue(
            sessionId, 
            newSession.ToString(), 
            TimeSpan.FromMinutes(5));
        
        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
        
        await _sendCodeToUpdatePasswordProducer.PublishEmailSend(new SendCodeToUpdatePasswordEvent(
            user.Email, verificationCode));

        return sessionId;
    }
    

    public async Task<string> SendCodeToChangeEmail(long userId)
    {
        var verificationCode = VerificationCode.GenerateVerificationCode();
        var sessionId = Guid.NewGuid().ToString();

        var user = await _identityUserRepository.GetUserById(userId);
        
        var sessionChangeEmail = new SessionVerifyEmail
        {
            Email = user.Email,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isAdded = await _redisService.SetValue(
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
        var sessionJson = await _redisService.GetValue(sessionId);

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
        
        var isUpdated = await _redisService.UpdateValue(
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
        var sessionValue = await _redisService.GetValue(sessionId);
        
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
        
        var isUpdate = await _redisService.UpdateValue(
            sessionId,
            sessionVerifyEmail.ToString(),
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
    }
    

    public async Task<string> SendCodeToConfirmNewEmail(string newEmail, string sessionId)
    {
        var sessionJson = await _redisService.GetValue(sessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия не найдена");
        }
        
        var session = JsonSerializer.Deserialize<SessionVerifyEmail>(sessionJson);
 
        if (session is null || !session.IsOk)
        {
            throw new SessionCodeNotValidException("Сессия не подтверждена");
        }
        
        var verificationCode = VerificationCode.GenerateVerificationCode();
        var newSessionId = Guid.NewGuid().ToString();
        
        var sessionChangeEmail = new SessionVerifyEmail
        {
            Email = newEmail,
            VerificationCode = verificationCode,
            IsOk = false
        };
        
        var isAdded = await _redisService.SetValue(
            newSessionId,
            sessionChangeEmail.ToString(),
            TimeSpan.FromMinutes(5));
        
        if (!isAdded)
        {
            throw new Exception($"Сессия не создана {newSessionId}");
        }
        
        await _sendCodeToConfirmNewEmailProducer.PublishEmailSend(new SendCodeToConfirmNewEmailEvent(
            newEmail,
            verificationCode));

        return newSessionId;
    }

    public async Task<string> ResendCodeToConfirmNewEmail(string sessionId, string newEmail)
    {
        var sessionJson = await _redisService.GetValue(sessionId);

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
        
        var isUpdated = await _redisService.UpdateValue(
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
        var sessionValue = await _redisService.GetValue(sessionId);
        
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
        
        var isUpdate = await _redisService.UpdateValue(
            sessionId,
            sessionVerifyEmail.ToString(),
            TimeSpan.FromMinutes(5));

        if (!isUpdate)
        {
            throw new Exception($"Сессия не обновлена {sessionId}");
        }
    }
}