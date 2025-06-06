﻿using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.ExistDirectoryOrFile;

[UsedImplicitly]
public class ExistDirectoryOrFileHandle: IRequestHandler<ExistDirectoryOrFileCommand, bool>
{
    private readonly IServerRepository _serverRepository;
    private readonly IConnectionService _connectionService;

    public ExistDirectoryOrFileHandle(IServerRepository serverRepository, 
        IConnectionService connectionService)
    {
        _serverRepository = serverRepository;
        _connectionService = connectionService;
    }

    public async Task<bool> Handle(ExistDirectoryOrFileCommand request, CancellationToken cancellationToken)
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

        try
        {
            await sftpClient.ConnectAsync(cancellationToken);
            
            return sftpClient.Exists(request.FolderOrFilePath);
        }
        finally
        {
            if (sftpClient.IsConnected)
            {
                sftpClient.Disconnect();
            }
        }
    }
}