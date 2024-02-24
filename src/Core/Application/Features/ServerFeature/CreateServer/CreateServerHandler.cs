using Application.Layers.Persistence.Repositories;
using Application.Layers.Persistence.Services;
using Application.Layers.Persistence.Services.Parameters;
using Application.Layers.Persistence.Services.Parameters.CheckConnectionServer;
using Application.Layers.Persistence.Services.Parameters.GetSystemType;
using Domain.DTOs.Server;
using Domain.Entities;
using Domain.Exceptions;
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
        var identity = await _identityRepository.GetIdentityDefaultAsync(request.IdentityId);
        
        if (identity is null)
        {
            throw new NotFoundException("Идентификатор с указанным 'IdentityId' не найдена.","IdentityId");
        }
        
        var getSystemServerTypeParameter = new GetSystemServerTypeParameter
        {
            Hostname = request.Hostname,
            SshPort = request.Port,
            Username = identity.Username,
            Password = identity.Password,
        };
        
        var checkConnectionServerParameter = new CheckConnectionServerParameter
        {
            Hostname = request.Hostname,
            SshPort = request.Port,
            Username = identity.Username,
            Password = identity.Password,
        };

        if (request.ProxyId is not null)
        {
            var proxy = await _proxyRepository.GetProxyDefaultAsync(request.ProxyId.Value);

            if (proxy is null)
            {
                throw new NotFoundException("Прокси сервер с указанным 'ProxyId' не найдена.", "ProxyId");
            }
            
            var proxyIdentity = await _identityRepository.GetIdentityAsync(proxy.IdentityId);
                    
            getSystemServerTypeParameter.Proxy = new ProxyParameter
            {
                Hostname = proxy.IpAddress,
                SshPort = proxy.Port,
                Username = proxyIdentity.Username,
                Password = proxyIdentity.Password
            };
            
            checkConnectionServerParameter.Proxy = new ProxyParameter
            {
                Hostname = proxy.IpAddress,
                SshPort = proxy.Port,
                Username = proxyIdentity.Username,
                Password = proxyIdentity.Password
            };
        }
        
        var isConnection = await _hostService.CheckConnectionServer(checkConnectionServerParameter, cancellationToken);

        if (!isConnection)
        {
            throw new ConnectionServerException("Не удалось установить соединение с сервером.","Hostname");
        }
        
        var systemType = await _hostService.GetSystemType(getSystemServerTypeParameter, cancellationToken);
        
        var serverResult = await _serverRepository.AddServerAsync(new Server
        {
            Title = request.Title,
            IpAddress = request.Hostname,
            Port = request.Port,
            StartupCommand = request.StartupCommand,
            IdentityId = request.IdentityId,
            UserId = request.UserId,
            ProxyId = request.ProxyId,
            DateCreated = DateTime.Now,
            ServerTypeId = systemType is not null ? (long)systemType : null
        });

        return CreateServerResponse.MapToServer(serverResult);
    }
}