using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.RegularExpressions;
using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using Application.Layers.Redis;
using Domain.Exceptions;
using Identity.Common;
using Identity.Interfaces;

namespace Identity.Services;

[SuppressMessage("GeneratedRegex", "SYSLIB1045:Преобразовать в \"GeneratedRegexAttribute\".")]
public class EmailService: IEmailService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IRedisService _redisService;

    public EmailService(IIdentityUserRepository identityUserRepository, 
        IRedisService redisService)
    {
        _identityUserRepository = identityUserRepository;
        _redisService = redisService;
    }

    public async Task<bool> ContainEmail(string email)
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

    public async Task UpdateEmail(UpdateEmailInput updateEmailInput)
    {
        var identityUser = await _identityUserRepository.GetUserById(updateEmailInput.UserId);
        var sessionJson = await _redisService.GetValue(updateEmailInput.SessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия подтверждения закончилась, повторите попытку");
        }

        var session = JsonSerializer.Deserialize<SessionVerifyEmail>(sessionJson);
 
        if (session is null || !session.IsOk)
        {
            throw new SessionCodeNotValidException("Сессия не подтверждена");
        }

        identityUser.Email = session.Email;

        await _identityUserRepository.UpdateUser(identityUser);
    }
}