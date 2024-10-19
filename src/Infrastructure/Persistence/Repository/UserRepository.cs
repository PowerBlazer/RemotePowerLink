using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class UserRepository: IUserRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public UserRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<User> GetUser(long userId)
    {
        var user = await _persistenceContext.Users
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (user is null)
        {
            throw new NotFoundException("Пользователь не найден", "User");
        }

        return user;
    }

    public async Task<User?> GetUserDefault(long userId)
    {
        var user = await _persistenceContext.Users
            .FirstOrDefaultAsync(p => p.UserId == userId);

        return user;
    }

    public async Task<User> AddUser(User user)
    {
        await _persistenceContext.Users.AddAsync(user);
        await _persistenceContext.SaveChangesAsync();

        return user;
    }

    public async Task<User> UpdateUser(User user)
    {
        var existingEntity = _persistenceContext.Users.Local
            .FirstOrDefault(e => e.Id == user.Id);

        if (existingEntity != null)
        {
            _persistenceContext.Entry(existingEntity).State = EntityState.Detached;
        }
        
        
        _persistenceContext.Users.Attach(user);
        _persistenceContext.Users.Update(user);

        await _persistenceContext.SaveChangesAsync();

        return user;
    }
}