﻿using Application.Helpers;
using Application.Hubs;
using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.DTOs.Notification;
using Domain.DTOs.Sftp;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;
using Renci.SshNet.Common;

namespace Application.Features.SftpFeature.UploadFiles;

[UsedImplicitly]
public class UploadFilesHandler: IRequestHandler<UploadFilesCommand, UploadFilesResponse>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly ISftpManagerService _sftpManagerService;
    private readonly IHubContext<SftpHub> _sftpHubContext;
    private Timer? _timer;

    private const long MaximumDownloadSizeBytes = 5368709120;
    
    public UploadFilesHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        ISftpManagerService sftpManagerService, 
        IHubContext<SftpHub> sftpHubContext)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _sftpManagerService = sftpManagerService;
        _sftpHubContext = sftpHubContext;
    }

    public async Task<UploadFilesResponse> Handle(UploadFilesCommand request, CancellationToken cancellationToken)
    {
        var totalUploadFilesSize = request.UploadFiles
            .Sum(p => p.Length);

        var uploadErrors = new Dictionary<string, List<string>>();
        if (totalUploadFilesSize >= MaximumDownloadSizeBytes)
        {
            throw new NoAccessException($"Превышен лимит 5GB выбранных файлов размера загрузки , выделенный размер " +
                                        $"{_sftpManagerService.FormatFileSize((ulong)totalUploadFilesSize)}", "Server");
        }
        
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
            
            var remainsSize = (ulong)totalUploadFilesSize;
            var totalRemainsSizeFiles = (ulong)totalUploadFilesSize;
            var previousTime = DateTime.Now;
            ulong previousUploadedBytes = 0;
            
            _timer = new Timer(_ =>
            {
                var downloadedBytes = (ulong)totalUploadFilesSize - remainsSize;
                
                ulong bytesSinceLastUpdate;
                if (downloadedBytes >= previousUploadedBytes)
                {
                    bytesSinceLastUpdate = downloadedBytes - previousUploadedBytes;
                }
                else
                {
                    bytesSinceLastUpdate = 0;
                }
                
                // Вычисляем прошедшее время с момента последнего обновления
                var currentTime = DateTime.Now;
                var elapsedTime = currentTime - previousTime;
                
                // Вычисляем скорость загрузки в байтах в секунду
                var downloadSpeed = bytesSinceLastUpdate / elapsedTime.TotalSeconds;
                var downloadSpeedString = $"{_sftpManagerService.FormatFileSize((ulong)downloadSpeed)}/c";
                var percentComplete = (double)downloadedBytes / (ulong)totalUploadFilesSize * 100;
                
                //Вычисляем оставшееся время для полного скачивания
                var remainingSeconds = (long)Math.Round(remainsSize / downloadSpeed, 0, MidpointRounding.AwayFromZero);
                var remainingTime = TimeSpan.FromSeconds(remainingSeconds >= 0 ? remainingSeconds : 0);

                var uploadNotificationData = new UploadNotification
                {
                    OperationName = "Загрузка файлов на сервер",
                    IsProgress = true,
                    ProgressPercent = (int)Math.Round(percentComplete, 0),
                    InformationText =
                        $"{_sftpManagerService.FormatFileSize(downloadedBytes)}/{_sftpManagerService.FormatFileSize((ulong)totalUploadFilesSize)}, " +
                        $"{downloadSpeedString}, about ~{_sftpManagerService.FormatTime(remainingTime)} remaining"
                };
                
                _sftpHubContext.Clients
                    .Client(request.ConnectionId)
                    .SendAsync("uploadReceive", uploadNotificationData, cancellationToken: cancellationToken);
                
                previousUploadedBytes = downloadedBytes;
                previousTime = currentTime;
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            
            foreach (var file in request.UploadFiles)
            {
                try
                {
                    await using var fileStream = file.OpenReadStream();

                    sftpClient.UploadFile(
                        fileStream, 
                        request.UploadPath + "/" + file.FileName, 
                        true,
                        uploadBytes =>
                        {
                            remainsSize = totalRemainsSizeFiles - uploadBytes;
                        });
                }
                catch (SftpPathNotFoundException ex)
                {
                    uploadErrors.Add(file.FileName, new List<string> { ex.Message });
                }
                catch (SftpPermissionDeniedException ex)
                {
                    uploadErrors.Add(file.FileName, new List<string> { ex.Message });
                }
                catch (SshException ex)
                {
                    uploadErrors.Add(file.FileName, new List<string> { ex.Message });
                }
                catch (Exception ex)
                {
                    uploadErrors.Add(file.FileName, new List<string> { ex.Message });
                }
                
                totalRemainsSizeFiles -= (ulong)file.Length;
            }

            return new UploadFilesResponse
            {
                Errors = uploadErrors
            };
        }
        finally
        {
            if (sftpClient.IsConnected)
            {
                sftpClient.Disconnect();
            }

            if (_timer is not null)
            {
                _timer.Dispose();
            }
        }
    }
}