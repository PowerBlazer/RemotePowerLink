using Application.Services.Abstract;
using Microsoft.AspNetCore.Authorization;

namespace Application.Hubs;

[Authorize]
public class TerminalHub: BaseHub
{
    private readonly ISessionConnectionService _sessionConnectionService;
    
    public TerminalHub(ISessionConnectionService sessionConnectionService)
    {
        _sessionConnectionService = sessionConnectionService;
    }

    public Task ActivateSession(long sessionId)
    {
        return HandlerOperation(() => _sessionConnectionService.ActivateSessionInstance(sessionId));
    }
    
    public Task DisactivateSession(long sessionId)
    {
        return HandlerOperation(() => _sessionConnectionService.DisactivateSessionInstance(sessionId));
    }


    public Task DisconnectFromSession(long sessionId)
    {
        return HandlerOperation(() => _sessionConnectionService.CloseSessionInstance(sessionId));
    }

    public Task WriteToSession(long sessionId, string message)
    {
        return HandlerOperation(() => _sessionConnectionService.WriteCommand(sessionId, message));
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        var openConnections = _sessionConnectionService.GetOpenedSessionsByUser(UserId);

        foreach (var openConnection in openConnections)
        {
            _sessionConnectionService.DisactivateSessionInstance(openConnection.Id);
        }
        
        return base.OnDisconnectedAsync(exception);
    }
}