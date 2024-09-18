using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.GetSizeFoldersOrFiles;

[UsedImplicitly]
public class GetSizeFoldersOrFilesHandler: IRequestHandler<GetSizeFoldersOrFilesCommand, ulong>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly ISftpService _sftpService;

    public GetSizeFoldersOrFilesHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        ISftpService sftpService)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _sftpService = sftpService;
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
        
        var connectionServerParameter = ConnectionServerParameter.ServerMapTo(server);
        var connectionInfo = _serverService.GetConnectionInfo(connectionServerParameter);
        
        using var sftpClient = new SftpClient(connectionInfo);
        try
        {
            await sftpClient.ConnectAsync(cancellationToken);

            ulong totalSizeFiles = 0;
            foreach (var fileItem in request.FoldersOrFiles)
            {
                totalSizeFiles += fileItem.FileType == FileTypeEnum.Folder
                    ? (ulong)_sftpService.GetDirectorySize(sftpClient, fileItem.Path)
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