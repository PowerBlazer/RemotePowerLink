﻿using Application.Layers.Persistence.Contexts;
using Application.Layers.Persistence.Repositories;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class ServerRepositrory: IServerRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public ServerRepositrory(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<Server> GetServerAsync(long serverId)
    {
        var server = await _persistenceContext.Servers
            .Include(p=>p.Identity)
            .Include(p=>p.Proxy)
            .Include(p=>p.ServerType)
            .FirstOrDefaultAsync(p => p.Id == serverId);

        if (server is null)
        {
            throw new NotFoundException("Сервер не найден");
        }

        return server;
    }

    public async Task<Server> AddServerAsync(Server server)
    {
        await _persistenceContext.Servers.AddAsync(server);

        return server;
    }
}