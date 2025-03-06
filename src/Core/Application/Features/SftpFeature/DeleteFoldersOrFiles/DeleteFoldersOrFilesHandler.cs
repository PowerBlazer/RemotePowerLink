using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.Enums;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;
using Renci.SshNet.Common;

namespace Application.Features.SftpFeature.DeleteFoldersOrFiles;

[UsedImplicitly]
public class DeleteFoldersOrFilesHandler: IRequestHandler<DeleteFoldersOrFilesCommand>
{
    private readonly IServerRepository _serverRepository;
    private readonly IConnectionService _connectionService;
    public DeleteFoldersOrFilesHandler(IServerRepository serverRepository, IConnectionService connectionService)
    {
        _serverRepository = serverRepository;
        _connectionService = connectionService;
    }

    public async Task Handle(DeleteFoldersOrFilesCommand request, CancellationToken cancellationToken)
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
        using var sshClient = new SshClient(connectionInfo);
        
        try
        {
            await sftpClient.ConnectAsync(cancellationToken);
            await sshClient.ConnectAsync(cancellationToken);
            
            var deleteErrors = new Dictionary<string,List<string>>();
            foreach (var sftpFileItem in request.FilesOrFoldersToDeleteList)
            {
                if(!sftpClient.Exists(sftpFileItem.Path))
                    continue;
                try
                {
                    if (sftpFileItem.FileType == FileTypeEnum.File)
                    {
                        await sftpClient.DeleteFileAsync(sftpFileItem.Path, cancellationToken);
                    }

                    if (sftpFileItem.FileType == FileTypeEnum.Folder)
                    {
                        if ((SystemTypeEnum)server.SystemTypeId == SystemTypeEnum.Windows)
                        {
                            var command = sshClient.RunCommand("rmdir /s /q \"" + sftpFileItem.Path.Trim('/') + "\"");
                            
                            if(!string.IsNullOrWhiteSpace(command.Error))
                                deleteErrors.Add(sftpFileItem.Path, new List<string>{ command.Error });
                        }

                        if ((SystemTypeEnum)server.SystemTypeId != SystemTypeEnum.Windows)
                        {
                            var command = sshClient.RunCommand("rm -rf \"" + sftpFileItem.Path + "\"");
                            
                            if(!string.IsNullOrWhiteSpace(command.Error))
                                deleteErrors.Add(sftpFileItem.Path, new List<string>{ command.Error });
                        }
                    }
                }
                catch (SshConnectionException ex)
                {
                    deleteErrors.Add(sftpFileItem.Path, new List<string>{ ex.Message });
                }
                catch (SftpPathNotFoundException ex)
                {
                    deleteErrors.Add(sftpFileItem.Path, new List<string>{ ex.Message });
                }
                catch (SftpPermissionDeniedException ex)
                {
                    deleteErrors.Add(sftpFileItem.Path, new List<string>{ ex.Message });
                }
                catch (SshException ex)
                {
                    deleteErrors.Add(sftpFileItem.Path, new List<string>{ ex.Message });
                }
            }

            if (deleteErrors.Count > 0)
            {
                throw new SftpException(deleteErrors);
            }
        }
        finally
        {
            if (sftpClient.IsConnected)
            {
                sftpClient.Disconnect();
            }

            if (sshClient.IsConnected)
            {
                sshClient.Disconnect();
            }
        }
    }
}