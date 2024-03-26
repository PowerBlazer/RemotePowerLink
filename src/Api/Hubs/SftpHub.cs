using Application.Services;
using Domain.DTOs.Sftp;
using Domain.Enums;
using Domain.Repository;
using Domain.Services;
using Domain.Services.Parameters;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

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
    public async Task GetFilesServer(long serverId, string path)
    {
        await HandlerOperationAsync(async () =>
        {
            var server = await _serverRepository.GetServerAsync(serverId);
            var connectionParameter = ConnectionServerParameter.ServerMapTo(server);

            var sftpClient = _sftpClientService.GetClient(connectionParameter);

            sftpClient.Disconnect();

            if (string.IsNullOrWhiteSpace(path))
            {
                path = sftpClient.WorkingDirectory;
            }

            var filesList = sftpClient
                .ListDirectory(path)
                .Where(p => p.Name is not ("." or ".."))
                .OrderByDescending(p => p.IsDirectory)
                .ThenBy(p => p.Name)
                .ToList();

            var serverFileList = new SftpFileList
            {
                CurrentPath = path,
                FileList = filesList.Select(p => new SftpFileItem
                {
                    Name = p.Name,
                    Path = p.FullName,
                    DateModified = p.LastWriteTime,
                    FileType = p.IsDirectory ? FileTypeEnum.Folder : FileTypeEnum.File,
                    Size = _sftpService.FormatFileSize(p.Length),
                    FileTypeName = _sftpService.GetFileExtension(p.Name)
                })
            };

            await Clients
                .Client(Context.ConnectionId)
                .SendAsync("ReceivedFiles", serverFileList);
        });
    }
}