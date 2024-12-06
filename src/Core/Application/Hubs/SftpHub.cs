using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.DTOs.Sftp;
using Domain.Enums;
using Domain.Exceptions;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;

namespace Application.Hubs;

[Authorize]
public class SftpHub: BaseHub
{
    private readonly ISftpConnectionService _sftpConnectionService;
    private readonly IServerRepository _serverRepository;
    private readonly ISftpManagerService _sftpManagerService;
    public SftpHub(ISftpConnectionService sftpConnectionService, 
        IServerRepository serverRepository, 
        ISftpManagerService sftpManagerService)
    {
        _sftpConnectionService = sftpConnectionService;
        _serverRepository = serverRepository;
        _sftpManagerService = sftpManagerService;
    }

    [UsedImplicitly]
    public Task GetFilesServer(long serverId, string path)
    {
        return HandlerOperation(async () =>
        {
            var sftpClient = await CreateOrGetSftpClient(serverId);
            
            if (string.IsNullOrWhiteSpace(path))
            {
                path = sftpClient.WorkingDirectory;
            }

            path = path.Replace("//", "/");
                
            var filesList = sftpClient
                .ListDirectory(path)
                .Where(p => p.Name is not ("." or ".."));

            var serverFileList = new SftpFileList
            {
                CurrentPath = path,
                FileList = filesList.Select(p => new SftpFileItem
                {
                    Name = p.Name,
                    Path = p.FullName,
                    DateModified = p.LastWriteTime,
                    FileType = p.IsDirectory ? FileTypeEnum.Folder : FileTypeEnum.File,
                    Size = p.Length,
                    FileTypeName = _sftpManagerService.GetFileExtension(p.Name)
                })
                .ToList()
            };

            var previousDirectoryPath = _sftpManagerService.GetParentDirectory(path);

            if (!string.IsNullOrEmpty(previousDirectoryPath))
            {
                serverFileList.FileList.Add(new SftpFileItem
                {
                    Name = "..",
                    Path = previousDirectoryPath,
                    FileType = FileTypeEnum.BackNavigation
                });
            }

            serverFileList.FileList = serverFileList.FileList
                .OrderByDescending(p=> p.FileType == FileTypeEnum.BackNavigation)
                .ThenByDescending(p => p.FileType == FileTypeEnum.Folder)
                .ThenBy(p => p.Name)
                .ToList();
            
            await Clients
                .Client(ConnectionKey)
                .SendAsync("ReceivedFiles", serverFileList);
        });
    }
    
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _sftpConnectionService.DisconnectClient(ConnectionKey);
        
        return base.OnDisconnectedAsync(exception);
    }

    private async Task<SftpClient> CreateOrGetSftpClient(long serverId)
    {
        var isExistSftpClient = _sftpConnectionService.CheckExistingConnection(ConnectionKey);

        if (!isExistSftpClient)
        {
            var server = await _serverRepository.GetServer(serverId);
            var connectionParameter = ConnectionServer.ServerMapTo(server);

            _sftpConnectionService.CreateClient(connectionParameter, ConnectionKey);
        }
            
        var sftpClient = _sftpConnectionService.GetClient(ConnectionKey);

        if (sftpClient is null)
        {
            throw new ConnectionServerException(
                $"Ошибка подключения SSH по ID ${serverId} сервера ConnectionID = ${ConnectionKey}",
                "Connection"
            );
        }

        return sftpClient;
    }
}