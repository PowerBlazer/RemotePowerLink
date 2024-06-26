﻿using Application.Layers.Persistence;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repository;
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

    public async Task<Identity?> GetIdentityDefaultAsync(long identityId)
    {
        var identity = await _persistenceContext.Identities
            .FirstOrDefaultAsync(p => p.Id == identityId);

        return identity;
    }

    public async Task<Identity> GetIdentityAsync(long identityId)
    {
        var identity = await _persistenceContext.Identities
            .FirstOrDefaultAsync(p => p.Id == identityId);
        
        if (identity is null)
        {
            throw new NotFoundException("Учетка не найдена", "IdentityId");
        }

        return identity;
    }

    public async Task<Identity> AddIdentityAsync(Identity identity)
    {
        await _persistenceContext.Identities.AddAsync(identity);
        await _persistenceContext.SaveChangesAsync();

        return identity;
    }

    public async Task<Identity> UpdateIdentityAsync(Identity identity)
    {
        _persistenceContext.Attach(identity);
        _persistenceContext.Identities.Update(identity);
        
        _persistenceContext
            .Entry(identity)
            .Property(p => p.DateCreated).IsModified = false;

        await _persistenceContext.SaveChangesAsync();

        return identity;
    }

    public async Task DeleteIdentityAsync(long identityId)
    {
        var identity = await _persistenceContext
            .Identities
            .FirstOrDefaultAsync(p => p.Id == identityId);

        if (identity is null)
        {
            throw new NotFoundException("Идентификатор с указанным 'IdentityId' не найден", "IdentityId");
        }

        _persistenceContext.Identities.Remove(identity);

        await _persistenceContext.SaveChangesAsync();
    }
}