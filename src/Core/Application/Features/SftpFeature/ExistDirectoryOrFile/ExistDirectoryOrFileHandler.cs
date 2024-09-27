using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.ExistDirectoryOrFile;

[UsedImplicitly]
public class ExistDirectoryOrFileHandle: IRequestHandler<ExistDirectoryOrFileCommand, bool>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;

    public ExistDirectoryOrFileHandle(IServerRepository serverRepository, 
        IServerService serverService)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
    }

    public async Task<bool> Handle(ExistDirectoryOrFileCommand request, CancellationToken cancellationToken)
    {
        var server = await _serverRepository.GetServer(request.ServerId);

        if (server.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.ServerId} ServerId",
                "Server");
        }
        
        var connectionServerParameter = ConnectionServerParameter.ServerMapTo(server);
        var connectionInfo = _serverService.GetConnectionInfo(connectionServerParameter);
        
        using var sftpClient = new SftpClient(connectionInfo);

        try
        {
            await sftpClient.ConnectAsync(cancellationToken);
            
            return sftpClient.Exists(request.FolderOrFilePath);
        }
        finally
        {
            if (sftpClient.IsConnected)
            {
                sftpClient.Disconnect();
            }
        }
    }
}