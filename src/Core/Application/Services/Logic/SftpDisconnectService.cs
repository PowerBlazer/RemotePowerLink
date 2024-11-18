using Application.Services.Abstract;

namespace Application.Services.Logic;

public class SftpDisconnectService : IDisposable
{
    private readonly ISftpConnectionService _sftpConnectionService;
    private Timer? _timer;

    public SftpDisconnectService(ISftpConnectionService sftpConnectionService)
    {
        _sftpConnectionService = sftpConnectionService;
    }

    public void Start()
    {
        _timer = new Timer(
            _ => _sftpConnectionService.DisconnectIdleClients(), 
            null, 
            TimeSpan.Zero, 
            TimeSpan.FromMinutes(5));
    }
    
    public void Dispose() => _timer?.Dispose();
}