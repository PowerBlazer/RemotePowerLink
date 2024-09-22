using System.Text.Json;
using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using Application.Layers.Redis;
using Domain.Common;
using Domain.Exceptions;
using Identity.Common;
using Identity.Interfaces;
using Identity.Models;
using UserData = Application.Layers.Identity.Models.UserData;

namespace Identity.Services;

public class UserService: IUserService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IIdentityTokenRepository _identityTokenRepository;
    private readonly IRedisService _redisService;
    private readonly IIdentityUnitOfWork _identityUnitOfWork;
    
    public UserService(IIdentityUserRepository identityUserRepository, 
        IIdentityTokenRepository identityTokenRepository, 
        IRedisService redisService, 
        IIdentityUnitOfWork identityUnitOfWork)
    {
        _identityUserRepository = identityUserRepository;
        _identityTokenRepository = identityTokenRepository;
        _redisService = redisService;
        _identityUnitOfWork = identityUnitOfWork;
    }

    public async Task<UserData> GetUserData(long userId)
    {
        var identityUser = await _identityUserRepository.GetUserById(userId);

        return new UserData
        {
            UserId = identityUser.Id,
            Email = identityUser.Email,
            DateCreated = identityUser.DateCreated,
            EmailConfirmed = identityUser.EmailConfirmed,
            PhoneNumber = identityUser.PhoneNumber,
            TwoFactorEnabled = identityUser.TwoFactorEnabled
        };
    }

    public async Task<UserData> UpdateUserData(UpdateUserDataInput updateUserDataInput)
    {
        var updateIdentityUserInput = new UpdateIdentityUserInput
        {
            Id = updateUserDataInput.UserId,
            PhoneNumber = updateUserDataInput.PhoneNumber,
        };

        var updatedUser = await _identityUserRepository.UpdateUserData(updateIdentityUserInput);
        
        return new UserData
        {
            UserId = updatedUser.Id,
            Email = updatedUser.Email,
            DateCreated = updatedUser.DateCreated,
            EmailConfirmed = updatedUser.EmailConfirmed,
            PhoneNumber = updatedUser.PhoneNumber,
            TwoFactorEnabled = updatedUser.TwoFactorEnabled
        };
    }
    public async Task UpdatePassword(UpdatePasswordInput updatePasswordInput)
    {
        var identityUser = await _identityUserRepository.GetUserById(updatePasswordInput.UserId);
        var sessionJson = await _redisService.GetValue(updatePasswordInput.SessionId);

        if (sessionJson is null)
        {
            throw new SessionCodeNotFoundException("Сессия подтверждения закончилась, повторите попытку");
        }

        var session = JsonSerializer.Deserialize<SessionResetPassword>(sessionJson);

        if (session is null || !session.IsOk)
        {
            throw new SessionCodeNotValidException("Сессия не подтверждена");
        }
        
        if (identityUser.PasswordHash != ComputeHash256.ComputeSha256Hash(updatePasswordInput.PreviousPassword))
        {
            throw new AuthenticationValidException("PreviousPassword","Неправильный пароль");
        }
        
        var newPasswordHash = ComputeHash256.ComputeSha256Hash(updatePasswordInput.NewPassword);

        identityUser.PasswordHash = newPasswordHash;

        await _identityUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            await _identityUserRepository.UpdateUser(identityUser);
            await _identityTokenRepository.DeleteTokensByUserId(identityUser.Id);
        });
    }
}