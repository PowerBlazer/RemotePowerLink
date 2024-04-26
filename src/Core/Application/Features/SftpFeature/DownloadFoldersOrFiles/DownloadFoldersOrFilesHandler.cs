using Application.Hubs;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Repository;
using Domain.Services;
using Domain.Services.Parameters;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.DownloadFoldersOrFiles;

[UsedImplicitly]
public class DownloadFoldersOrFilesHandler: IRequestHandler<DownloadFoldersOrFilesCommand, string>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly ISftpService _sftpService;
    private readonly IHubContext<SftpHub> _sftpHubContext;

    private const long MaximumDownloadSizeBytes = 5368709120;
    private ulong _totalSizeFiles = 0;
    private ulong _remainsSize = 0;
    
    public DownloadFoldersOrFilesHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        IHubContext<SftpHub> sftpHubContext, 
        ISftpService sftpService)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _sftpHubContext = sftpHubContext;
        _sftpService = sftpService;
    }

    public async Task<string> Handle(DownloadFoldersOrFilesCommand request, CancellationToken cancellationToken)
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
            
            foreach (var fileItem in request.FilesOrFoldersToDownloadList)
            {
                _totalSizeFiles += fileItem.FileType == FileTypeEnum.Folder
                    ? (ulong)_sftpService.GetDirectorySize(sftpClient, fileItem.Path)
                    : (ulong)(fileItem.Size ?? 0);
            }

            if (_totalSizeFiles >= MaximumDownloadSizeBytes)
            {
                throw new NoAccessException($"Превышен лимит 5GB выбранных файлов размера скачивания , выделенный размер " +
                                            $"{_sftpService.FormatFileSize((long)_totalSizeFiles)}", "Server");
            }

            _remainsSize = _totalSizeFiles;
            
            var tempDirectory = Path.Combine(request.TempPath!, Guid.NewGuid().ToString());
            
            Console.WriteLine($"TotalSize: {_totalSizeFiles}");
            
            var timer = new Timer(_ =>
            {
                Console.WriteLine(_remainsSize);
            }, null, TimeSpan.Zero, TimeSpan.FromMilliseconds(500));
            
            foreach (var fileItem in request.FilesOrFoldersToDownloadList)
            {
                if (fileItem.FileType == FileTypeEnum.File)
                {
                    var tempFilePath = Path.Combine(tempDirectory, fileItem.Name);
                    await using var fileStream = File.Create(tempFilePath);
                
                    sftpClient.DownloadFile(fileItem.Path, fileStream, sendBytes =>
                    {
                        _remainsSize = _totalSizeFiles - sendBytes;
                    });
                    
                    _totalSizeFiles -= (ulong)fileItem.Size!;
                }

                if (fileItem.FileType == FileTypeEnum.Folder)
                {
                    await DownloadFolderAsync(sftpClient, fileItem.Path, tempDirectory, cancellationToken);
                }
            }
            
            await timer.DisposeAsync();

            return request.TempPath!;

        }
        finally
        {
            if (sftpClient.IsConnected)
            {
                sftpClient.Disconnect();
            }
        }
    }
    
    private async Task DownloadFolderAsync(SftpClient client, 
        string folderPath, 
        string destinationPath,
        CancellationToken cancellationToken)
    {
        var folderName = Path.GetFileName(folderPath);
        var folderDestination = Path.Combine(destinationPath, folderName);
        
        Directory.CreateDirectory(folderDestination);

        // Получаем список файлов и поддиректорий в папке
        var items = client.ListDirectoryAsync(folderPath, cancellationToken);
        
        await foreach (var item in items)
        {
            // Игнорируем ссылки на текущую и родительскую директории
            if (item.IsDirectory && (item.Name == "." || item.Name == ".."))
                continue;
            
            if (item.IsDirectory)
            {
                // Если это директория, рекурсивно скачиваем её содержимое
                await DownloadFolderAsync(client, item.FullName, folderDestination, cancellationToken);
            }
            
            if(!item.IsDirectory)
            {
                // Если это файл, скачиваем его
                await using var fileStream = File.Create(Path.Combine(folderDestination, item.Name));
                
                client.DownloadFile(item.FullName, fileStream,sendBytes =>
                {
                    _remainsSize = _totalSizeFiles - sendBytes;
                });
                
                _totalSizeFiles -= (ulong)item.Length;
            }
        }
    } 
}