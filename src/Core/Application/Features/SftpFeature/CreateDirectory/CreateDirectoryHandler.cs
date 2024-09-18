using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.Exceptions;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.CreateDirectory;

[UsedImplicitly]
public class CreateDirectoryHandler: IRequestHandler<CreateDirectoryCommand>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;

    public CreateDirectoryHandler(IServerRepository serverRepository, 
        IServerService serverService)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
    }

    public async Task Handle(CreateDirectoryCommand request, CancellationToken cancellationToken)
    {
        var server = await _serverRepository.GetServerAsync(request.ServerId);

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