using System.Collections.Concurrent;
using Application.Builders.Abstract;
using Application.Hubs;
using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Session;
using Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Renci.SshNet.Common;

namespace Application.Services.Logic;

public class SessionConnectionService: ISessionConnectionService
{
    private readonly ConcurrentDictionary<long, ISessionInstance> _sessionInstances = new();
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly string? _rootPath;
    private readonly IHubContext<TerminalHub> _terminalHubContext;

    public SessionConnectionService(IServiceScopeFactory serviceScopeFactory, string? rootPath,
        IHubContext<TerminalHub> terminalHubContext)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _rootPath = rootPath;
        _terminalHubContext = terminalHubContext;
    }


    public Task WriteCommand(long sessionId, string command)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Соединение закрыто с таким SessionId:{sessionId}");
        
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
        
        var logFilePath = Path.Combine(_rootPath!, "Files", "SessionLogs", Guid.NewGuid() + ".txt");

        var sessionInstance = await sessionBuilder
            .SetUser(userId)
            .SetServer(serverId)
            .SetLogFilePath(logFilePath)
            .SetOutputAction((data,sessionId) =>
                _terminalHubContext.Clients
                    .User(userId.ToString())
                    .SendAsync("SessionOutput", new SessionOutputData
                    {
                        SessionId = sessionId,
                        Data = data
                    }, cancellationToken: cancellationToken)
            )
            .Build();
        
        _sessionInstances.AddOrUpdate(sessionInstance.Id, sessionInstance, (_, _) => sessionInstance);

        try
        {
            await sessionInstance.CreateConnection(cancellationToken);
        }
        catch (SshAuthenticationException)
        {
            _sessionInstances.TryRemove(sessionInstance.Id, out _);

            throw new SessionException("Authentication", "Ошибка аутентификации: проверьте логин и пароль");
        }
        catch (Exception)
        {
            _sessionInstances.TryRemove(sessionInstance.Id, out _);
            
            throw;
        }
        
        
        return sessionInstance;
    }
    
    public async Task<ISessionInstance> ActivateSessionInstance(long sessionId)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Соединение закрыто с таким SessionId:{sessionId}");
        
        var sessionData = await sessionInstance.GetFullSessionData();
        
        await _terminalHubContext.Clients
            .User(sessionInstance.UserId.ToString())
            .SendAsync("SessionOutput", new SessionOutputData
            {
                SessionId = sessionId,
                Data = sessionData
            }, cancellationToken: default);
            
        sessionInstance.IsActive = true;

        return sessionInstance;
    }

    public IEnumerable<ISessionInstance> GetOpenedSessionsByUser(long userId)
    {
        return _sessionInstances.Values.Where(s => s.UserId == userId);
    }

    public IEnumerable<ISessionInstance> GetAllOpenedSessions()
    {
        return _sessionInstances.Values;
    }

    public async Task CloseSessionInstance(long sessionId)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Соединение закрыто с таким SessionId:{sessionId}");
        
        await sessionInstance.DisconnectConnection();
        
        _sessionInstances.TryRemove(sessionId, out _);
    }

    public void DisactivateSessionInstance(long sessionId)
    {
        if (!_sessionInstances.TryGetValue(sessionId, out var sessionInstance))
            throw new SessionException("SessionId", $"Соединение закрыто с таким SessionId:{sessionId}");
        
        sessionInstance.IsActive = false;
    }


}