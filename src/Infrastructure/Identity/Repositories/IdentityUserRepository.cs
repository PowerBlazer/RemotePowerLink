using Identity.Contexts;
using Identity.Entities;
using Identity.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Identity.Repositories;

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

    public Task<IdentityUser?> GetUserByEmailAsync(string email)
    {
        return _identityContext.IdentityUsers.FirstOrDefaultAsync(p => p.Email == email);
    }

    public Task<IdentityUser?> GetUserByIdAsync(long userId)
    {
        return _identityContext.IdentityUsers.FirstOrDefaultAsync(p => p.Id == userId);
    }
}