using Application.Layers.Persistence.Repositories;
using Application.Layers.Persistence.Services;
using Application.Layers.Persistence.Services.Parameters;
using Application.Layers.Persistence.Services.Parameters.GetSystemType;
using Domain.DTOs.Server;
using Domain.Entities;
using MediatR;

namespace Application.Features.ServerFeature.CreateServer;

public class CreateServerHandler: IRequestHandler<CreateServerCommand, CreateServerResponse>
{
    private readonly IServerRepository _serverRepository;
    private readonly IHostService _hostService;
    private readonly IIdentityRepository _identityRepository;
    private readonly IProxyRepository _proxyRepository;

    public CreateServerHandler(IServerRepository serverRepository, 
        IHostService hostService, 
        IIdentityRepository identityRepository, 
        IProxyRepository proxyRepository)
    {
        _serverRepository = serverRepository;
        _hostService = hostService;
        _identityRepository = identityRepository;
        _proxyRepository = proxyRepository;
    }

    public async Task<CreateServerResponse> Handle(CreateServerCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentityAsync(request.IdentityId);
        var proxy = await _proxyRepository.GetProxyDefaultAsync(request.ProxyId ?? 0);
                
        var getSystemServerTypeParameter = new GetSystemServerTypeParameter
        {
            Hostname = request.Hostname,
            SshPort = request.Port,
            Username = identity.Username,
            Password = identity.Password,
        };

        if (proxy is not null)
        {
            var proxyIdentity = await _identityRepository.GetIdentityAsync(proxy.IdentityId);
                    
            getSystemServerTypeParameter.Proxy = new ProxyParameter
            {
                Hostname = proxy.Ip,
                SshPort = proxy.Port,
                Username = proxyIdentity.Username,
                Password = proxyIdentity.Password
            };
        }

        var systemType = await _hostService.GetSystemType(getSystemServerTypeParameter, cancellationToken);
        
        var serverResult = await _serverRepository.AddServerAsync(new Server
        {
            Title = request.Title,
            Ip = request.Hostname,
            Port = request.Port,
            StartupCommand = request.StartupCommand,
            IdentityId = request.IdentityId,
            UserId = request.UserId,
            ProxyId = request.ProxyId,
            ServerTypeId = systemType is not null ? (long)systemType : null
        });

        return new CreateServerResponse
        {
            Hostname = serverResult.Ip,
            Title = serverResult.Title,
            Port = serverResult.Port,
            StartupCommand = serverResult.StartupCommand,
            IdentityId = serverResult.IdentityId,
            ProxyId = serverResult.ProxyId
        };
    }
}