using System.Collections.Concurrent;
using Application.Builders.Abstract;
using Application.Hubs;
using Application.Layers.Persistence.Repository;
using Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Services.Logic;

public class SessionConnectionService
{
    private readonly ConcurrentDictionary<long, ISessionInstance> _sessionInstances = new();
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly string? _rootPath;
    private readonly IHubContext<TerminalHub> _terminulHubContext;

    public SessionConnectionService(IServiceScopeFactory serviceScopeFactory, string? rootPath,
        IHubContext<TerminalHub> terminulHubContext)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _rootPath = rootPath;
        _terminulHubContext = terminulHubContext;
    }


    public Task WriteCommand(long sessionId, string command)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Сессия с таким SessionId {sessionId} не найден");
        
        return sessionInstance.WriteCommand(command);
    }

    public async Task<ISessionInstance> CreateSessionInstance(long serverId, 
        long userId,
        CancellationToken cancellationToken = default)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var serverRepository = scope.ServiceProvider.GetRequiredService<IServerRepository>();
        var sessionBuilder = scope.ServiceProvider.GetRequiredService<ISessionInstanceBuilder>();
        
        var server = await serverRepository.GetServer(serverId);

        if (server.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }
        
        var logFilePath = Path.Combine(_rootPath!,"Files", "SessionLogs", Guid.NewGuid() + ".txt");

        var sessionInstance = await sessionBuilder
            .SetUser(userId)
            .SetServer(serverId)
            .SetLogFilePath(logFilePath)
            .SetOutputAction(data =>
                _terminulHubContext.Clients
                    .User(userId.ToString())
                    .SendAsync("SessionOutput", data, cancellationToken: cancellationToken)
            )
            .Build();
        
        _sessionInstances.AddOrUpdate(sessionInstance.Id, sessionInstance, (_, _) => sessionInstance);

        await sessionInstance.CreateConnection(cancellationToken);

        return sessionInstance;
    }

    public async Task<ISessionInstance> ActivateSessionInstance(long sessionId,  Action<string> outputAction)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Сессия с таким SessionId {sessionId} не найден");
        
        var sessionData = await sessionInstance.GetFullSessionData();
            
        outputAction.Invoke(sessionData);
            
        sessionInstance.IsActive = true;
        //sessionInstance.OutputCallback = outputAction;

        return sessionInstance;
    }

    public IEnumerable<ISessionInstance> GetSessionInstancesInUser(long userId)
    {
        return _sessionInstances.Values.Where(s => s.UserId == userId);
    }

    public async Task CloseSessionInstance(long sessionId)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Сессия с таким SessionId {sessionId} не найден");
        
        await sessionInstance.DiconnectConnection();
        
        _sessionInstances.TryRemove(sessionId, out _);
    }

    public void DisactivateSessionInstance(long sessionId)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Сессия с таким SessionId {sessionId} не найден");
        
        sessionInstance.IsActive = false;
    }


}