﻿using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using Domain.Exceptions;
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

    public async Task<Proxy?> GetProxyDefault(long proxyId)
    {
        var proxy = await _persistenceContext.Proxies
            .FirstOrDefaultAsync(p => p.Id == proxyId);

        return proxy;
    }

    public async Task<Proxy> GetProxy(long proxyId)
    {
        var proxy = await _persistenceContext.Proxies
            .FirstOrDefaultAsync(p=>p.Id == proxyId);

        if (proxy is null)
        {
            throw new NotFoundException("Идентификатор с указанным 'ProxyId' не найдена.","ProxyId");
        }

        return proxy;
    }

    public async Task<Proxy> AddProxy(Proxy proxy)
    {
        await _persistenceContext.Proxies.AddAsync(proxy);
        await _persistenceContext.SaveChangesAsync();

        return proxy;
    }

    public async Task<Proxy> UpdateProxy(Proxy proxy)
    {
        var existingEntity = _persistenceContext.Proxies.Local
            .FirstOrDefault(e => e.Id == proxy.Id);

        if (existingEntity != null)
        {
            _persistenceContext.Entry(existingEntity).State = EntityState.Detached;
        }
        
        
        _persistenceContext.Attach(proxy);
        _persistenceContext.Proxies.Update(proxy);
        
        _persistenceContext
            .Entry(proxy)
            .Property(p => p.DateCreated).IsModified = false;

        await _persistenceContext.SaveChangesAsync();

        return proxy;
    }

    public async Task DeleteProxy(long proxyId)
    {
        var proxy = await _persistenceContext
            .Proxies
            .FirstOrDefaultAsync(p => p.Id == proxyId);

        if (proxy is null)
        {
            throw new NotFoundException("Прокси-сервер с указанным 'ProxyId' не найден", "ProxyId");
        }

        _persistenceContext.Proxies.Remove(proxy);

        await _persistenceContext.SaveChangesAsync();
    }
}