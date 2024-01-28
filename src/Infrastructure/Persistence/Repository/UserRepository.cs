using Application.Layers.Persistence.Contexts;
using Application.Layers.Persistence.Repositories;
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

    public async Task<User> GetUserAsync(long userId)
    {
        var user = await _persistenceContext.Users
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (user is null)
        {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }
}