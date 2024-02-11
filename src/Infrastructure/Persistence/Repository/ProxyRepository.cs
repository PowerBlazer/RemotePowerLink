using Application.Layers.Persistence.Contexts;
using Application.Layers.Persistence.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class ProxyRepository: IProxyRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public ProxyRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<IEnumerable<Proxy>> GetProxiesInUser(long userId)
    {
        var proxies = await _persistenceContext.Proxies
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return proxies;
    }
}