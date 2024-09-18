using Application.Hubs;
using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.DTOs.Notification;
using Domain.DTOs.Sftp;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;
using Renci.SshNet.Common;

namespace Application.Features.SftpFeature.SendFoldersOrFiles;

[UsedImplicitly]
public class SendFoldersOrFilesHandler: IRequestHandler<SendFoldersOrFilesCommand,SendFoldersOrFilesResponse>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly ISftpService _sftpService;
    private readonly IHubContext<SftpHub> _sftpHubContext;
    
    private const long MaximumSendSizeBytes = 5368709120;
    private ulong _totalSizeFiles;
    private ulong _totalRemainsSizeFiles;
    private ulong _remainsSize;
    
    private readonly Dictionary<string, List<string>> _sendErrors = new();
    private Timer? _timer;
    
    public SendFoldersOrFilesHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        ISftpService sftpService, 
        IHubContext<SftpHub> sftpHubContext)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _sftpService = sftpService;
        _sftpHubContext = sftpHubContext;
    }

    public async Task<SendFoldersOrFilesResponse> Handle(SendFoldersOrFilesCommand request, CancellationToken cancellationToken)
    {
        var targetServer = await _serverRepository.GetServer(request.TargetServerId);
        var sourceServer = await _serverRepository.GetServer(request.SourceServerId);

        if (targetServer.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.TargetServerId} ServerId",
                "Server");
        }
        
        if (sourceServer.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.SourceServerId} ServerId",
                "Server");
        }
        
        var targetConnectionServerParameter = ConnectionServerParameter.ServerMapTo(targetServer);
        var sourceConnectionServerParameter = ConnectionServerParameter.ServerMapTo(sourceServer);
        var targetConnectionInfo = _serverService.GetConnectionInfo(targetConnectionServerParameter);
        var sourceConnectionInfo = _serverService.GetConnectionInfo(sourceConnectionServerParameter);

        using var sourceSftpClient = new SftpClient(sourceConnectionInfo);
        using var targetSftpClient = new SftpClient(targetConnectionInfo);

        try
        {
            await sourceSftpClient.ConnectAsync(cancellationToken);
            await targetSftpClient.ConnectAsync(cancellationToken);

            sourceSftpClient.BufferSize = 1024 * 1024 * 10; // 5 МБ
            targetSftpClient.BufferSize = 1024 * 1024 * 10;
            
            foreach (var fileItem in request.FoldersOrFilesToSendList)
            {
                _totalSizeFiles += fileItem.FileType == FileTypeEnum.Folder
                    ? (ulong)_sftpService.GetDirectorySize(sourceSftpClient, fileItem.Path)
                    : (ulong)(fileItem.Size ?? 0);
            }

            if (_totalSizeFiles >= MaximumSendSizeBytes)
            {
                throw new NoAccessException($"Превышен лимит 5GB выбранных файлов, выделенный размер " +
                                            $"{_sftpService.FormatFileSize(_totalSizeFiles)}", "Server");
            }

            _totalRemainsSizeFiles = _totalSizeFiles;
            _remainsSize = _totalRemainsSizeFiles;

            var previousTime = DateTime.Now;
            ulong previousSendedBytes = 0;
            
            _timer = new Timer(_ =>
            {
                var sendedBytes = _totalSizeFiles - _remainsSize;
                
                ulong bytesSinceLastUpdate;
                if (sendedBytes >= previousSendedBytes)
                {
                    bytesSinceLastUpdate = sendedBytes - previousSendedBytes;
                }
                else
                {
                    bytesSinceLastUpdate = 0;
                }

                // Вычисляем прошедшее время с момента последнего обновления
                var currentTime = DateTime.Now;
                var elapsedTime = currentTime - previousTime;

                // Вычисляем скорость скачивания в байтах в секунду
                var uploadSpeed = bytesSinceLastUpdate / elapsedTime.TotalSeconds;
                var downloadSpeedString = $"{_sftpService.FormatFileSize((ulong)uploadSpeed)}/c";
                var percentComplete = (double)sendedBytes / _totalSizeFiles * 100;

                //Вычисляем оставшееся время для полного скачивания
                var remainingSeconds = (long)Math.Round(_remainsSize / uploadSpeed, 0, MidpointRounding.AwayFromZero);
                var remainingTime = TimeSpan.FromSeconds(remainingSeconds >= 0 ? remainingSeconds : 0);

                var downloadNotitifactionData = new SendNotification
                {
                    OperationName = "Отправка файлов",
                    IsProgress = true,
                    ProgressPercent = (int)Math.Round(percentComplete, 0),
                    InformationText =
                        $"{_sftpService.FormatFileSize(sendedBytes)}/{_sftpService.FormatFileSize(_totalSizeFiles)}, " +
                        $"{downloadSpeedString}, about ~{_sftpService.FormatTime(remainingTime)} remaining"
                };

                 _sftpHubContext.Clients
                    .Client(request.ConnectionId)
                    .SendAsync("sendReceive", downloadNotitifactionData, cancellationToken: cancellationToken);

                // Обновляем значения для следующей итерации
                previousSendedBytes = sendedBytes;
                previousTime = currentTime;
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            
            foreach (var fileItem in request.FoldersOrFilesToSendList)
            {
                await TransferPath(sourceSftpClient, 
                    targetSftpClient, 
                    fileItem.Path, 
                    fileItem.Size,
                    request.RemotePath);
            }
        }
        finally
        {
            if (_timer is not null)
            {
                await _timer.DisposeAsync();
            }
            
            if (sourceSftpClient.IsConnected)
            {
                sourceSftpClient.Disconnect();
            }

            if (targetSftpClient.IsConnected)
            {
                targetSftpClient.Disconnect();
            }
        }

        return new SendFoldersOrFilesResponse
        {
            Errors = _sendErrors
        };
    }
    
    
    private async Task TransferPath(SftpClient sourceClient, 
        SftpClient targetClient, 
        string sourcePath,
        long? sourceLenght,
        string destinationFolderPath)
    {
        // Получаем имя файла или папки
        var fileName = sourcePath.Substring(sourcePath.LastIndexOf('/') + 1);

        // Собираем путь для целевого сервера
        var destinationPath = destinationFolderPath + "/" + fileName;
        
        // Проверяем, является ли указанный путь папкой
        if (sourceClient.Exists(sourcePath) && sourceClient.GetAttributes(sourcePath).IsDirectory)
        {
            // Создаем папку на целевом сервере, если она не существует
            if (!targetClient.Exists(destinationPath))
            {
                targetClient.CreateDirectory(destinationPath);
            }
            
            // Если это папка, рекурсивно передаем все файлы и подпапки
            var files = sourceClient.ListDirectory(sourcePath);
            foreach (var file in files)
            {
                if (!file.Name.Equals(".") && !file.Name.Equals(".."))
                {
                    await TransferPath(sourceClient, 
                        targetClient, 
                        $"{sourcePath}/{file.Name}", 
                        file.Length, 
                        destinationPath);
                }
            }
        }
        else
        {
            // Если это файл, передаем его
            await using var sourceStream = sourceClient.OpenRead(sourcePath);
            
            try
            {
                targetClient.UploadFile(sourceStream, destinationPath, sendBytes =>
                {
                    _remainsSize = _totalRemainsSizeFiles - sendBytes;
                });
            }
            catch (SftpPathNotFoundException ex)
            {
                _sendErrors.Add(sourcePath, new List<string>{ ex.Message });
            }
            catch (SftpPermissionDeniedException ex)
            {
                _sendErrors.Add(sourcePath, new List<string>{ ex.Message });
            }
            catch (SshException ex)
            {
                _sendErrors.Add(sourcePath, new List<string>{ ex.Message });
            }
            
            _totalRemainsSizeFiles -= (ulong)(sourceLenght ?? 0);
        }
    }
}