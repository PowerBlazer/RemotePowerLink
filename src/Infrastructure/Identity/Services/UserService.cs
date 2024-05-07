using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using Domain.Exceptions;
using Identity.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Identity.Services;

public class UserService: IUserService
{
    private readonly IdentityContext _identityContext;

    public UserService(IdentityContext identityContext)
    {
        _identityContext = identityContext;
    }

    public async Task<UserInformation> GetUserInformationAsync(long userId)
    {
        var identityUser = await _identityContext
            .IdentityUsers
            .FirstOrDefaultAsync(p => p.Id == userId);

        if (identityUser is null)
        {
            throw new NotFoundException("Пользователь с указанным 'UserId' не найден", "UserId");
        }

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