using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using Domain.Exceptions;
using Identity.Interfaces;

namespace Identity.Services;

public class UserService: IUserService
{
    private readonly IIdentityUserRepository _identityUserRepository;
    public UserService(IIdentityUserRepository identityUserRepository)
    {
        _identityUserRepository = identityUserRepository;
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
}