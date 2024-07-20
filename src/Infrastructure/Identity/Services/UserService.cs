using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using Domain.Common;
using Domain.DTOs.Authorization;
using Domain.Exceptions;
using Identity.Interfaces;

namespace Identity.Services;

public class UserService: IUserService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IIdentityTokenRepository _identityTokenRepository;
    public UserService(IIdentityUserRepository identityUserRepository, 
        IIdentityTokenRepository identityTokenRepository)
    {
        _identityUserRepository = identityUserRepository;
        _identityTokenRepository = identityTokenRepository;
    }

    public async Task<UserInformation> GetUserInformationAsync(long userId)
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
        
        if (identityUser.PasswordHash != ComputeHash256.ComputeSha256Hash(updatePasswordRequest.PreviousPassword))
        {
            throw new AuthenticationValidException("PreviousPassword","Неправильный пароль");
        }
        
        var newPasswordHash = ComputeHash256.ComputeSha256Hash(updatePasswordRequest.NewPassword);

        identityUser.PasswordHash = newPasswordHash;

        await _identityUserRepository.UpdateUserAsync(identityUser);
        await _identityTokenRepository.DeleteTokensByUserIdAsync(identityUser.Id);
    }
}