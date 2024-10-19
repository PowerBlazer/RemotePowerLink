using Application.Services.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Application.Hubs;

[Authorize]
public class TerminalHub: BaseHub
{
    private readonly SessionConnectionService _sessionConnectionService;
    
    public TerminalHub(SessionConnectionService sessionConnectionService)
    {
        _sessionConnectionService = sessionConnectionService;
    }

    public Task OpenSessionConnection(long serverId)
    {
        return HandlerOperation(() => 
            _sessionConnectionService.CreateSessionInstance(serverId, UserId)
        );
    }

    public Task ConnectToSession(long sessionId)
    {
        return HandlerOperation(() =>
            _sessionConnectionService.ActivateSessionInstance(sessionId, outputData =>
            {
                Clients.Client(ConnectionKey).SendAsync("SessionOutput", outputData);
            }));
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
       
}