using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class SystemTypeRepository: ISystemTypeRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public SystemTypeRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<SystemType?> GetSystemTypeDefault(long systemTypeId)
    {
        var systemType = await _persistenceContext.SystemTypes
            .FirstOrDefaultAsync(p => p.Id == systemTypeId);

        return systemType;
    }

    public async Task<SystemType> GetSystemType(long systemTypeId)
    {
        var systemType = await _persistenceContext.SystemTypes
            .FirstAsync(p => p.Id == systemTypeId);

        return systemType;
    }
}