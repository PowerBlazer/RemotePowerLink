using System.Linq.Expressions;
using Domain.Exceptions;
using Identity.Contexts;
using Identity.Entities;
using Identity.Interfaces;
using Identity.Models;
using Microsoft.EntityFrameworkCore;

namespace Identity.Repositories;

public class IdentityUserRepository: IIdentityUserRepository
{
    private readonly IdentityContext _identityContext;

    public IdentityUserRepository(IdentityContext identityContext)
    {
        _identityContext = identityContext;
    }

    public async Task<IdentityUser> AddUser(IdentityUser identityUser)
    {
        var userEntity = await _identityContext.IdentityUsers.AddAsync(identityUser);

        await _identityContext.SaveChangesAsync();

        return userEntity.Entity;
    }

    public Task<IdentityUser?> GetUserByEmail(string email)
    {
        return _identityContext.IdentityUsers.FirstOrDefaultAsync(p => p.Email == email);
    }

    public async Task<IdentityUser> GetUserById(long userId)
    {
        var identityUser = await _identityContext.IdentityUsers
            .FirstOrDefaultAsync(p => p.Id == userId);
        
        if (identityUser is null)
        {
            throw new NotFoundException("Пользователь с указанным 'UserId' не найден", "UserId");
        }

        return identityUser;
    }

    public async Task<IdentityUser> UpdateUser(IdentityUser identityUser)
    {
        _identityContext.Attach(identityUser);
        _identityContext.IdentityUsers.Update(identityUser);

        _identityContext.Entry(identityUser)
            .Property(p => p.DateCreated).IsModified = false;

        await _identityContext.SaveChangesAsync();

        return identityUser;
    }

    public async Task<IdentityUser> UpdateUserData(UpdateIdentityUserInput updateIdentityUserInput)
    {
        var identityUser = await GetUserById(updateIdentityUserInput.Id);

        identityUser.PhoneNumber = updateIdentityUserInput.PhoneNumber;
        
        _identityContext.IdentityUsers.Update(identityUser);
        
        await _identityContext.SaveChangesAsync();

        return identityUser;
    }
}