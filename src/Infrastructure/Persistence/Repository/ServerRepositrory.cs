using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
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

    public async Task<Server> GetServer(long serverId)
    {
        var server = await _persistenceContext.Servers
            .Include(p=> p.Identity)
            .Include(p=> p.Proxy).ThenInclude(x=> x!.Identity)
            .Include(p=> p.SystemType)
            .Include(p=> p.Encoding)
            .FirstOrDefaultAsync(p => p.Id == serverId);

        if (server is null)
        {
            throw new NotFoundException("Сервер с указанным 'ServerId' не найден", "ServerId");
        }

        return server;
    }

    public async Task<Server?> GetServerDefault(long serverId)
    {
        var server = await _persistenceContext.Servers
            .Include(p=> p.Identity)
            .Include(p=> p.Proxy).ThenInclude(x=> x!.Identity)
            .Include(p=> p.SystemType)
            .Include(p=> p.Encoding)
            .FirstOrDefaultAsync(p => p.Id == serverId);
        
        return server;
    }

    public async Task<Server> AddServer(Server server)
    {
        await _persistenceContext.Servers.AddAsync(server);
        await _persistenceContext.SaveChangesAsync();
        
        return server;
    }

    public async Task<IEnumerable<Server>> GetServersInUser(long userId)
    {
        var servers = await _persistenceContext.Servers
            .Include(p => p.Identity)
            .Include(p => p.Proxy)
            .Include(p => p.SystemType)
            .Include(p=> p.Encoding)
            .Where(p=> p.UserId == userId)
            .ToListAsync();

        return servers;
    }

    public async Task<Server> UpdateServer(Server server)
    {
        _persistenceContext.Attach(server);
        
        _persistenceContext.Servers.Update(server);
        
        _persistenceContext
            .Entry(server)
            .Property(p => p.DateCreated).IsModified = false;

        await _persistenceContext.SaveChangesAsync();

        return server;
    }

    public async Task DeleteServer(long serverId)
    {
        var server = await _persistenceContext
            .Servers
            .FirstOrDefaultAsync(p => p.Id == serverId);

        if (server is null)
        {
            throw new NotFoundException("Сервер с указанным 'ServerId' не найден", "ServerId");
        }

        _persistenceContext.Servers.Remove(server);

        await _persistenceContext.SaveChangesAsync();
    }
}