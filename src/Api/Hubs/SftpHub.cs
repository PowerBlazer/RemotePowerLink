using System.Security.Claims;
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
public class SftpHub: Hub
{
    private long UserId
    {
        get
        {
            var user = Context.User;
            
            if (user is not null)
            {
                return long.Parse(user.Claims.First(p => p.Type == ClaimTypes.NameIdentifier).Value);
            }

            return long.MinValue;
        }
    }

    private readonly ISftpClientService _sftpClientService;
    private readonly IServerRepository _serverRepository;
    private readonly ISftpService _sftpService;
    public SftpHub(ISftpClientService sftpClientService, 
        IServerRepository serverRepository, 
        ISftpService sftpService)
    {
        _sftpClientService = sftpClientService;
        _serverRepository = serverRepository;
        _sftpService = sftpService;
    }

    [UsedImplicitly]
    public async Task GetFilesServer(long serverId, string path)
    {
        var server = await _serverRepository.GetServerAsync(serverId);
        var connectionParameter = ConnectionServerParameter.ServerMapTo(server);

        var sftpClient = _sftpClientService.GetClient(connectionParameter);

        if (string.IsNullOrWhiteSpace(path))
        {
            path = sftpClient.WorkingDirectory;
        }
        
        var files = sftpClient
            .ListDirectory(path)
            .ToList();
        
        var serverFileList = new SftpFileList
        {
            CurrentPath = path,
            FileList = files.Select(p => new SftpFileItem
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
    }
}