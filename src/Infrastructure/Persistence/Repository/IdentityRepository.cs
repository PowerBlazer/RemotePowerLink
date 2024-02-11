using Application.Layers.Persistence.Contexts;
using Application.Layers.Persistence.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class IdentityRepository: IIdentityRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public IdentityRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<IEnumerable<Identity>> GetIdentitiesInUser(long userId)
    {
        var identities = await _persistenceContext.Identities
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return identities;
    }
}