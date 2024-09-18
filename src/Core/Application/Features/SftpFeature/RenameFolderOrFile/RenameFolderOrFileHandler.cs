using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.Exceptions;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;
using Renci.SshNet;

namespace Application.Features.SftpFeature.RenameFolderOrFile;

[UsedImplicitly]
public class RenameFolderOrFileHandler: IRequestHandler<RenameFolderOrFileCommand>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;

    public RenameFolderOrFileHandler(IServerRepository serverRepository, 
        IServerService serverService)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
    }

    public async Task Handle(RenameFolderOrFileCommand request, CancellationToken cancellationToken)
    {
        var server = await _serverRepository.GetServer(request.ServerId);

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
            
            if (!sftpClient.Exists(request.FileItemPath))
            {
                throw new SftpException("Server", $"Файл или папки с таким путем не найдена: {request.FileItemPath}");
            }
            
            var parts = request.FileItemPath.Split('/');
            // Создаем новый массив, включающий все элементы пути, кроме последнего
            var basePathParts = parts.Take(parts.Length - 1).ToArray();
            // Объединяем элементы массива обратно в путь
            var basePath = string.Join("/", basePathParts);
            // Заменяем последний элемент на новое имя
            var newPath = basePath + "/" + request.FileItemNewName;

            await sftpClient.RenameFileAsync(request.FileItemPath, newPath, cancellationToken);

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