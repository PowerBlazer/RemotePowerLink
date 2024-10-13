using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.DTOs.Server;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.ServerFeature.EditServer;

[UsedImplicitly]
public class EditServerHandler: IRequestHandler<EditServerCommand, EditServerResponse>
{
    private readonly IServerService _serverService;
    private readonly IIdentityRepository _identityRepository;
    private readonly IProxyRepository _proxyRepository;
    private readonly IServerRepository _serverRepository;
    private readonly IEncodingRepository _encodingRepository;

    public EditServerHandler(IServerService serverService, 
        IIdentityRepository identityRepository, 
        IProxyRepository proxyRepository, 
        IServerRepository serverRepository, 
        IEncodingRepository encodingRepository)
    {
        _serverService = serverService;
        _identityRepository = identityRepository;
        _proxyRepository = proxyRepository;
        _serverRepository = serverRepository;
        _encodingRepository = encodingRepository;
    }

    public async Task<EditServerResponse> Handle(EditServerCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentityDefault(request.IdentityId);
        var encoding = await _encodingRepository.GetEncoding(request.EncodingId);
        var server = await _serverRepository.GetServer(request.ServerId);

        if (server.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.ServerId} ServerId",
                "Server");
        }
        
        if (identity is null)
        {
            throw new NotFoundException("Идентификатор с указанным 'IdentityId' не найдена.","IdentityId");
        }
        
        var connectionServerParameter = new ConnectionServer
        {
            Hostname = request.Hostname,
            SshPort = request.SshPort,
            Username = identity.Username,
            Password = identity.Password,
            EncodingCodePage = encoding.CodePage
        };
        
        if (request.ProxyId is not null)
        {
            var proxy = await _proxyRepository.GetProxyDefault(request.ProxyId.Value);

            if (proxy is null)
            {
                throw new NotFoundException("Прокси сервер с указанным 'ProxyId' не найдена.", "ProxyId");
            }
            
            var proxyIdentity = await _identityRepository.GetIdentity(proxy.IdentityId);
            
            connectionServerParameter.ConnectionProxy = new ConnectionProxy
            {
                Hostname = proxy.IpAddress,
                SshPort = proxy.SshPort,
                Username = proxyIdentity.Username,
                Password = proxyIdentity.Password,
                EncodingCodePage = encoding.CodePage
            };
        }
        
        var isConnection = await _serverService.CheckConnectionServer(connectionServerParameter, cancellationToken);

        if (!isConnection)
        {
            throw new ConnectionServerException("Не удалось установить соединение с сервером.","Hostname");
        }
        
        var systemType = await _serverService.GetSystemType(connectionServerParameter, cancellationToken);

        var updatedServer = await _serverRepository
            .UpdateServer(EditServerCommand.MapToServer(request, systemType.SystemTypeId));
        
        var editServerResponse = EditServerResponse.MapServerTo(updatedServer);

        return editServerResponse;
    }
}