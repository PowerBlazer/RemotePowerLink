using Application.Hubs;
using Application.Services.Abstract;
using Microsoft.AspNetCore.SignalR;

namespace Application.Services.Logic;

public class SessionDisconnectService: IDisposable
{
    private const int IdleTimeoutMinutes = 2;
    private readonly ISessionConnectionService _sessionConnectionService;
    private readonly IHubContext<TerminalHub> _terminalHub;
    private Timer? _timer;
    
    
    public SessionDisconnectService(ISessionConnectionService sessionConnectionService, 
        IHubContext<TerminalHub> terminalHub)
    {
        _sessionConnectionService = sessionConnectionService;
        _terminalHub = terminalHub;

        
    }

    public void Start()
    {
        _timer = new Timer(
            _ => TimerAction(), 
            null, 
            TimeSpan.Zero, 
            TimeSpan.FromMinutes(2));
    }

    public void Dispose() => _timer?.Dispose();
    
    private async void TimerAction()
    {
        var currentTime = DateTime.Now;

        var sessions = _sessionConnectionService
            .GetAllOpenedSessions()
            .Where(p => (currentTime - p.LastUpdated).TotalMinutes >= IdleTimeoutMinutes || !p.IsConnected);

        foreach (var session in sessions)
        {
            await _sessionConnectionService.CloseSessionInstance(session.Id);
            
            await _terminalHub.Clients
                .User(session.UserId.ToString())
                .SendAsync("SessionDisconected", session.Id);
        }
    }

}