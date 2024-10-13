using System.Collections.Concurrent;
using Application.Builders.Abstract;
using Application.Layers.Persistence.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Services.Logic;

public class SessionConnectionService
{
    private readonly ConcurrentDictionary<long, ISessionInstance> _sessionInstances = new();
    private readonly object _lock = new();
    private const int IdleTimeoutMinutes = 10;
    
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public SessionConnectionService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task<ISessionInstance> CreateSessionInstance(long serverId, long userId, Action<string> outputAction)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        
        var serverRepository = scope.ServiceProvider.GetRequiredService<IServerRepository>();
        
        var server = await serverRepository.GetServer(serverId);

        if (server.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }
        
        
        throw new AggregateException();
    }

    public Task<ISessionInstance> GetSessionInstance(long sessionId,  Action<string> outputAction)
    {
        throw new AggregateException();
    }

    public Task<IEnumerable<ISessionInstance>> GetSessionInstancesInUser(long userId)
    {
        throw new AggregateException();
    }

    public Task CloseSessionInstance(long sessionId)
    {
        throw new AggregateException();
    }

    public Task DisactivateSessionInstance(long sessionId)
    {
        throw new AggregateException();
    }


}