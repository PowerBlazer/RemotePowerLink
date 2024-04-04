using Application.Services;
using Domain.DTOs.Sftp;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Repository;
using Domain.Services;
using Domain.Services.Parameters;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;

namespace Api.Hubs;

[Authorize]
public class SftpHub: BaseHub
{
    private readonly ISftpClientService _sftpClientService;
    private readonly IServerRepository _serverRepository;
    private readonly ISftpService _sftpService;
    public SftpHub(ISftpClientService sftpClientService, 
        IServerRepository serverRepository, 
        ISftpService sftpService, SftpIdleDisconnectService sftpIdleDisconnectService)
    {
        _sftpClientService = sftpClientService;
        _serverRepository = serverRepository;
        _sftpService = sftpService;
        
        sftpIdleDisconnectService.StartTimer();
    }

    [UsedImplicitly]
    public Task GetFilesServer(long serverId, string path)
    {
        return HandlerOperationAsync(async () =>
        {
            var sftpClient = await CreateOrGetSftpClient(serverId);
            
            if (string.IsNullOrWhiteSpace(path))
            {
                path = sftpClient.WorkingDirectory;
            }

            if (path == "//")
            {
                path = "/";
            }

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
                    Size = p.Length.ToString(),
                    FileTypeName = _sftpService.GetFileExtension(p.Name)
                })
                .ToList()
            };

            var previousDirectoryPath = _sftpService.GetParentDirectory(path);

            if (!string.IsNullOrEmpty(previousDirectoryPath))
            {
                serverFileList.FileList.Add(new SftpFileItem
                {
                    Name = "..",
                    Path = previousDirectoryPath,
                    FileType = FileTypeEnum.Folder,
                });
            }

            serverFileList.FileList = serverFileList.FileList
                .OrderByDescending(p=> p.Name == "..")
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
        _sftpClientService.DisconnectClient(ConnectionKey);
        
        return base.OnDisconnectedAsync(exception);
    }

    private async Task<SftpClient> CreateOrGetSftpClient(long serverId)
    {
        var isExistSftpClient = _sftpClientService.CheckExistingConnection(ConnectionKey);

        if (!isExistSftpClient)
        {
            var server = await _serverRepository.GetServerAsync(serverId);
            var connectionParameter = ConnectionServerParameter.ServerMapTo(server);

            _sftpClientService.CreateClient(connectionParameter, ConnectionKey);
        }
            
        var sftpClient = _sftpClientService.GetClient(ConnectionKey);

        if (sftpClient is null)
        {
            throw new ConnectionServerException(
                $"Ошибка подключения SSH по ID ${serverId} сервера ConnectionID = ${ConnectionKey}",
                "Server"
            );
        }

        return sftpClient;
    }
}