using Application.Helpers;
using Application.Hubs;
using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.DTOs.Notification;
using Domain.DTOs.Sftp;
using Domain.Enums;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;
using Renci.SshNet.Common;

namespace Application.Features.SftpFeature.DownloadFoldersOrFiles;

[UsedImplicitly]
public class DownloadFoldersOrFilesHandler: IRequestHandler<DownloadFoldersOrFilesCommand, DownloadFolderOrFilesResponse>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly ISftpManagerService _sftpManagerService;
    private readonly IHubContext<SftpHub> _sftpHubContext;

    private const long MaximumDownloadSizeBytes = 5368709120;
    private ulong _totalSizeFiles;
    private ulong _totalRemainsSizeFiles;
    private ulong _remainsSize;

    private readonly Dictionary<string, List<string>> _downloadErrors;
    private Timer? _timer;
    
    public DownloadFoldersOrFilesHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        IHubContext<NotificationHub> notificationHubContext, 
        ISftpManagerService sftpManagerService, 
        IHubContext<SftpHub> sftpHubContext)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _sftpManagerService = sftpManagerService;
        _sftpHubContext = sftpHubContext;

        _downloadErrors = new Dictionary<string, List<string>>();
    }

    public async Task<DownloadFolderOrFilesResponse> Handle(DownloadFoldersOrFilesCommand request, CancellationToken cancellationToken)
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
            
            foreach (var fileItem in request.FilesOrFoldersToDownloadList)
            {
                _totalSizeFiles += fileItem.FileType == FileTypeEnum.Folder
                    ? (ulong)_sftpManagerService.GetDirectorySize(sftpClient, fileItem.Path)
                    : (ulong)(fileItem.Size ?? 0);
            }

            if (_totalSizeFiles >= MaximumDownloadSizeBytes)
            {
                throw new NoAccessException($"Превышен лимит 5GB выбранных файлов размера скачивания , выделенный размер " +
                                            $"{_sftpManagerService.FormatFileSize(_totalSizeFiles)}", "Server");
            }

            _totalRemainsSizeFiles = _totalSizeFiles;
            _remainsSize = _totalRemainsSizeFiles;
            
            var tempDirectory = Path.Combine(request.TempPath!, Guid.NewGuid().ToString());

            if (!Directory.Exists(tempDirectory))
                Directory.CreateDirectory(tempDirectory);
            
            
            var previousTime = DateTime.Now;
            ulong previousDownloadedBytes = 0;
            
            _timer = new Timer(_ =>
            {
                var downloadedBytes = _totalSizeFiles - _remainsSize;
                
                ulong bytesSinceLastUpdate;
                if (downloadedBytes >= previousDownloadedBytes)
                {
                    bytesSinceLastUpdate = downloadedBytes - previousDownloadedBytes;
                }
                else
                {
                    bytesSinceLastUpdate = 0;
                }

                // Вычисляем прошедшее время с момента последнего обновления
                var currentTime = DateTime.Now;
                var elapsedTime = currentTime - previousTime;

                // Вычисляем скорость скачивания в байтах в секунду
                var downloadSpeed = bytesSinceLastUpdate / elapsedTime.TotalSeconds;
                var downloadSpeedString = $"{_sftpManagerService.FormatFileSize((ulong)downloadSpeed)}/c";
                var percentComplete = (double)downloadedBytes / _totalSizeFiles * 100;

                //Вычисляем оставшееся время для полного скачивания
                var remainingSeconds = (long)Math.Round(_remainsSize / downloadSpeed, 0, MidpointRounding.AwayFromZero);
                var remainingTime = TimeSpan.FromSeconds(remainingSeconds >= 0 ? remainingSeconds : 0);

                var downloadNotitifactionData = new DownloadNotification
                {
                    OperationName = "Загрузка файлов",
                    IsProgress = true,
                    ProgressPercent = (int)Math.Round(percentComplete, 0),
                    InformationText =
                        $"{_sftpManagerService.FormatFileSize(downloadedBytes)}/{_sftpManagerService.FormatFileSize(_totalSizeFiles)}, " +
                        $"{downloadSpeedString}, about ~{_sftpManagerService.FormatTime(remainingTime)} remaining"
                };

                 _sftpHubContext.Clients
                    .Client(request.ConnectionId)
                    .SendAsync("downloadReceive", downloadNotitifactionData, cancellationToken: cancellationToken);

                // Обновляем значения для следующей итерации
                previousDownloadedBytes = downloadedBytes;
                previousTime = currentTime;
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            
            foreach (var fileItem in request.FilesOrFoldersToDownloadList)
            {
                if (fileItem.FileType == FileTypeEnum.File)
                {
                    var tempFilePath = Path.Combine(tempDirectory, fileItem.Name);
                    await using var fileStream = File.Create(tempFilePath);
                    
                    try
                    {
                        sftpClient.DownloadFile(fileItem.Path, fileStream, sendBytes =>
                        {
                            _remainsSize = _totalRemainsSizeFiles - sendBytes;
                        });
                    }
                    catch (SftpPathNotFoundException ex)
                    {
                        _downloadErrors.Add(fileItem.Path, new List<string>{ ex.Message });
                    }
                    catch (SftpPermissionDeniedException ex)
                    {
                        _downloadErrors.Add(fileItem.Path, new List<string>{ ex.Message });
                    }
                    catch (SshException ex)
                    {
                        _downloadErrors.Add(fileItem.Path, new List<string>{ ex.Message });
                    }
                    
                    _totalRemainsSizeFiles -= (ulong)fileItem.Size!;
                }

                if (fileItem.FileType == FileTypeEnum.Folder)
                {
                    await DownloadFolder(sftpClient, fileItem.Path, tempDirectory, cancellationToken);
                }
            }
            
            return new DownloadFolderOrFilesResponse
            {
                FolderTempPath = tempDirectory,
                Errors = _downloadErrors
            };

        }
        finally
        {
            if (sftpClient.IsConnected)
                sftpClient.Disconnect();
            
            if(_timer is not null)
                await _timer.DisposeAsync();
        }
    }
    
    private async Task DownloadFolder(SftpClient client, 
        string folderPath, 
        string destinationPath,
        CancellationToken cancellationToken)
    {
        if (client == null) 
            throw new ArgumentNullException(nameof(client));
        
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
                await DownloadFolder(client, item.FullName, folderDestination, cancellationToken);
            }
            
            if(!item.IsDirectory)
            {
                // Если это файл, скачиваем его
                await using var fileStream = File.Create(Path.Combine(folderDestination, item.Name));

                try
                {
                    client.DownloadFile(item.FullName, fileStream,
                        sendBytes => { _remainsSize = _totalRemainsSizeFiles - sendBytes; });
                }
                catch (SftpPathNotFoundException ex)
                {
                    _downloadErrors.Add(item.FullName, new List<string>{ ex.Message });
                }
                catch (SftpPermissionDeniedException ex)
                {
                    _downloadErrors.Add(item.FullName, new List<string>{ ex.Message });
                }
                catch (SshException ex)
                {
                    _downloadErrors.Add(item.FullName, new List<string>{ ex.Message });
                }
                
                _totalRemainsSizeFiles -= (ulong)item.Length;
            }
        }
    }
}