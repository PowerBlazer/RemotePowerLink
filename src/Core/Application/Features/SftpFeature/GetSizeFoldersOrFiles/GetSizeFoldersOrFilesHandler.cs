using Application.Helpers;
using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.Enums;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.GetSizeFoldersOrFiles;

[UsedImplicitly]
public class GetSizeFoldersOrFilesHandler: IRequestHandler<GetSizeFoldersOrFilesCommand, ulong>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly ISftpManagerService _sftpManagerService;

    public GetSizeFoldersOrFilesHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        ISftpManagerService sftpManagerService)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _sftpManagerService = sftpManagerService;
    }

    public async Task<ulong> Handle(GetSizeFoldersOrFilesCommand request, CancellationToken cancellationToken)
    {
        var server = await _serverRepository.GetServer(request.ServerId);

        if (server.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.ServerId} ServerId",
                "Server");
        }
        
        var connectionServerParameter = ConnectionServer.ServerMapTo(server);
        var connectionInfo = ConnectionMapper.GetConnectionInfo(connectionServerParameter);
        
        using var sftpClient = new SftpClient(connectionInfo);
        try
        {
            await sftpClient.ConnectAsync(cancellationToken);

            ulong totalSizeFiles = 0;
            foreach (var fileItem in request.FoldersOrFiles)
            {
                totalSizeFiles += fileItem.FileType == FileTypeEnum.Folder
                    ? (ulong)_sftpManagerService.GetDirectorySize(sftpClient, fileItem.Path)
                    : (ulong)(fileItem.Size ?? 0);
            }

            return totalSizeFiles;
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