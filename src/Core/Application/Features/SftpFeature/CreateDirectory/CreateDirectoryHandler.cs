using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.CreateDirectory;

[UsedImplicitly]
public class CreateDirectoryHandler: IRequestHandler<CreateDirectoryCommand>
{
    private readonly IServerRepository _serverRepository;
    private readonly IConnectionService _connectionService;

    public CreateDirectoryHandler(IServerRepository serverRepository, IConnectionService connectionService)
    {
        _serverRepository = serverRepository;
        _connectionService = connectionService;
    }

    public async Task Handle(CreateDirectoryCommand request, CancellationToken cancellationToken)
    {
        var server = await _serverRepository.GetServer(request.ServerId);

        if (server.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.ServerId} ServerId",
                "Server");
        }

        var connectionServerParameter = ConnectionServer.ServerMapTo(server);
        var connectionInfo = _connectionService.GetConnectionConfiguration(connectionServerParameter);
        
        using var sftpClient = new SftpClient(connectionInfo);
        
        try
        {
            await sftpClient.ConnectAsync(cancellationToken);
            
            if (!sftpClient.Exists(request.DirectoryPath))
            {
                throw new NotFoundException(
                    $"Директория с таким путем '{request.DirectoryPath}' не найдена", "Server");
            }
            
            sftpClient.CreateDirectory(request.DirectoryPath + "/" + request.DirectoryName);
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