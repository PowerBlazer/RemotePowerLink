
using Identity.Contexts;
using Identity.Entities;
using Identity.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PowerMessenger.Infrastructure.Identity.Repositories;

public class IdentityUserRepository: IIdentityUserRepository
{
    private readonly IdentityContext _identityContext;

    public IdentityUserRepository(IdentityContext identityContext)
    {
        _identityContext = identityContext;
    }

    public async Task<IdentityUser> AddUserAsync(IdentityUser identityUser)
    {
        var userEntity = await _identityContext.IdentityUsers.AddAsync(identityUser);

        await _identityContext.SaveChangesAsync();

        return userEntity.Entity;
    }

    public async Task<IdentityUser?> GetUserByEmailAsync(string email)
    {
        return await _identityContext.IdentityUsers.FirstOrDefaultAsync(p => p.Email == email);
    }

    public async Task<IdentityUser?> GetUserByIdAsync(long userId)
    {
        return await _identityContext.IdentityUsers.FirstOrDefaultAsync(p => p.Id == userId);
    }
}