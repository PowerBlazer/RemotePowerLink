using Application.Layers.Persistence.Services;
using Application.Layers.Persistence.Services.Parameters;
using Domain.DTOs.Server;
using Domain.Exceptions;
using Domain.Repository;
using MediatR;

namespace Application.Features.ServerFeature.EditServer;

public class EditServerHandler: IRequestHandler<EditServerCommand, EditServerResponse>
{
    private readonly IHostService _hostService;
    private readonly IIdentityRepository _identityRepository;
    private readonly IProxyRepository _proxyRepository;
    private readonly IServerRepository _serverRepository;

    public EditServerHandler(IHostService hostService, 
        IIdentityRepository identityRepository, 
        IProxyRepository proxyRepository, 
        IServerRepository serverRepository)
    {
        _hostService = hostService;
        _identityRepository = identityRepository;
        _proxyRepository = proxyRepository;
        _serverRepository = serverRepository;
    }

    public async Task<EditServerResponse> Handle(EditServerCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentityDefaultAsync(request.IdentityId);
        
        if (identity is null)
        {
            throw new NotFoundException("Идентификатор с указанным 'IdentityId' не найдена.","IdentityId");
        }
        
        var connectionServerParameter = new ConnectionServerParameter
        {
            Hostname = request.Hostname,
            SshPort = request.SshPort,
            Username = identity.Username,
            Password = identity.Password
        };
        
        if (request.ProxyId is not null)
        {
            var proxy = await _proxyRepository.GetProxyDefaultAsync(request.ProxyId.Value);

            if (proxy is null)
            {
                throw new NotFoundException("Прокси сервер с указанным 'ProxyId' не найдена.", "ProxyId");
            }
            
            var proxyIdentity = await _identityRepository.GetIdentityAsync(proxy.IdentityId);
            
            connectionServerParameter.Proxy = new ProxyParameter
            {
                Hostname = proxy.IpAddress,
                SshPort = proxy.SshPort,
                Username = proxyIdentity.Username,
                Password = proxyIdentity.Password
            };
        }
        
        var isConnection = await _hostService.CheckConnectionServer(connectionServerParameter, cancellationToken);

        if (!isConnection)
        {
            throw new ConnectionServerException("Не удалось установить соединение с сервером.","Hostname");
        }
        
        var systemType = await _hostService.GetSystemType(connectionServerParameter, cancellationToken);

        var updatedServer = await _serverRepository
            .UpdateServerAsync(EditServerCommand.MapToServer(request, systemType.SystemTypeId));
        
        var editServerResponse = EditServerResponse.MapServerTo(updatedServer);

        return editServerResponse;
    }
}