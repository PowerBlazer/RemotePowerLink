using Application.Layers.Persistence.Contexts;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repository;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class UserRepository: IUserRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public UserRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<User> GetUserAsync(long userId)
    {
        var user = await _persistenceContext.Users
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (user is null)
        {
            throw new NotFoundException("Пользователь не найден", "User");
        }

        return user;
    }

    public async Task<User?> GetUserDefaultAsync(long userId)
    {
        var user = await _persistenceContext.Users
            .FirstOrDefaultAsync(p => p.UserId == userId);

        return user;
    }

    public async Task<User> AddUserAsync(User user)
    {
        await _persistenceContext.Users.AddAsync(user);
        await _persistenceContext.SaveChangesAsync();

        return user;
    }
}