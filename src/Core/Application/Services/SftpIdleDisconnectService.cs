using Domain.Services;

namespace Application.Services;

public class SftpIdleDisconnectService
{
    private readonly ISftpClientService _sftpClientService;
    private readonly Timer _timer;

    public SftpIdleDisconnectService(ISftpClientService sftpClientService)
    {
        _sftpClientService = sftpClientService;
        _timer = new Timer(DisconnectIdleClients, null, TimeSpan.Zero, TimeSpan.FromMinutes(5)); // Проверяем каждую минуту
    }

    private void DisconnectIdleClients(object? state)
    {
        _sftpClientService.DisconnectIdleClients();
    }

    public void Dispose()
    {
        _timer.Dispose();
    }
}