using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.DTOs.Server;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.ServerFeature.CreateServer;

[UsedImplicitly]
public class CreateServerHandler: IRequestHandler<CreateServerCommand, CreateServerResponse>
{
    private readonly IServerRepository _serverRepository;
    private readonly IServerService _serverService;
    private readonly IIdentityRepository _identityRepository;
    private readonly IProxyRepository _proxyRepository;
    private readonly IEncodingRepository _encodingRepository;

    public CreateServerHandler(IServerRepository serverRepository, 
        IServerService serverService, 
        IIdentityRepository identityRepository, 
        IProxyRepository proxyRepository, 
        IEncodingRepository encodingRepository)
    {
        _serverRepository = serverRepository;
        _serverService = serverService;
        _identityRepository = identityRepository;
        _proxyRepository = proxyRepository;
        _encodingRepository = encodingRepository;
    }

    public async Task<CreateServerResponse> Handle(CreateServerCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentityDefault(request.IdentityId);
        var encoding = await _encodingRepository.GetEncoding(request.EncodingId);
        
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
        
        var serverResult = await _serverRepository
            .AddServer(CreateServerCommand.MapToServer(request, systemType.SystemTypeId));

        var createServerResponse = CreateServerResponse.MapToServer(serverResult);
        
        return createServerResponse;
    }
}