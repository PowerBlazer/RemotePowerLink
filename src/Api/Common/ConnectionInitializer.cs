using Application.Services.Logic;

namespace Api.Common;

public class ConnectionInitializer: IHostedService
{
    private readonly SessionDisconnectService _sessionDisconnectService;
    private readonly SftpDisconnectService _sftpDisconnectService;

    public ConnectionInitializer(SftpDisconnectService sftpDisconnectService, 
        SessionDisconnectService sessionDisconnectService)
    {
        _sftpDisconnectService = sftpDisconnectService;
        _sessionDisconnectService = sessionDisconnectService;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _sessionDisconnectService.Start();
        _sftpDisconnectService.Start();
        
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _sessionDisconnectService.Dispose();
        _sftpDisconnectService.Dispose();
        
        return Task.CompletedTask;
    }
}