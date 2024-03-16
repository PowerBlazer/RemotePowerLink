using System.Security.Claims;
using Domain.DTOs.Sftp;
using Domain.Enums;
using Domain.Repository;
using Domain.Services;
using Domain.Services.Parameters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

[Authorize]
public class SftpHub: Hub
{
    private long UserId => long.Parse(Context.User?.Claims
        .FirstOrDefault(p=> p.Type == ClaimTypes.NameIdentifier)?.Value!);
    
    private readonly ISftpClientService _sftpClientService;
    private readonly IServerRepository _serverRepository;
    public SftpHub(ISftpClientService sftpClientService, 
        IServerRepository serverRepository)
    {
        _sftpClientService = sftpClientService;
        _serverRepository = serverRepository;
    }

    public async Task GetFilesServer(long serverId, string path)
    {
        var server = await _serverRepository.GetServerAsync(serverId);
        var connectionParameter = ConnectionServerParameter.ServerMapTo(server);

        var sftpClient = _sftpClientService.GetClient(connectionParameter);
        var files = sftpClient.ListDirectory(path).ToList();

        var serverFileList = new SftpFileList
        {
            CurrentPath = path,
            FileList = files.Select(p => new SftpFileData
            {
                Name = p.Name,
                Path = p.FullName,
                DateModified = p.LastWriteTime,
                FileType = p.IsDirectory ? FileTypeEnum.Folder : FileTypeEnum.File,
                Size = p.Length.ToString(),
                FileTypeName = GetFileExtension(p.Name)
            })
        };

        await Clients
            .User(UserId.ToString())
            .SendAsync("ReceivedFiles", serverFileList);
    }
    

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
    
    private static string GetFileExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName);
        return extension.TrimStart('.').ToLowerInvariant();
    }
}