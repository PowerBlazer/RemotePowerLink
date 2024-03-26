using Domain.Services;

namespace Application.Services;

public class SftpIdleDisconnectService
{
    private readonly ISftpClientService _sftpClientService;
    private Timer? _timer;

    public SftpIdleDisconnectService(ISftpClientService sftpClientService)
    {
        _sftpClientService = sftpClientService;
        
    }

    public void StartTimer()
    {
        _timer = new Timer(
            _ => _sftpClientService.DisconnectIdleClients(), 
            null, 
            TimeSpan.Zero, 
            TimeSpan.FromMinutes(5)); // Проверяем каждую минуту
    }
    
    public void Dispose()
    {
        _timer.Dispose();
    }
}