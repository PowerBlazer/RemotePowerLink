using Domain.DTOs.Proxy;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Layers.Persistence.Services;
using Domain.Layers.Persistence.Services.Parameters;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.ProxyFeature.CreateProxy;

[UsedImplicitly]
public class CreateProxyHandler: IRequestHandler<CreateProxyCommand, CreateProxyResponse>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IProxyRepository _proxyRepository;
    private readonly IHostService _hostService;

    public CreateProxyHandler(IIdentityRepository identityRepository,
        IProxyRepository proxyRepository, 
        IHostService hostService)
    {
        _identityRepository = identityRepository;
        _proxyRepository = proxyRepository;
        _hostService = hostService;
    }

    public async Task<CreateProxyResponse> Handle(CreateProxyCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentityDefaultAsync(request.IdentityId);

        if (identity is null)
        {
            throw new NotFoundException("Идентификатор с указанным 'IdentityId' не найдена.","IdentityId");
        }
        
        var checkConnectionServerParameter = new ConnectionServerParameter
        {
            Hostname = request.Hostname,
            SshPort = request.SshPort,
            Username = identity.Username,
            Password = identity.Password
        };
                
        var isConnection = await _hostService.CheckConnectionServer(checkConnectionServerParameter, cancellationToken);

        if (!isConnection)
        {
            throw new ConnectionServerException("Не удалось установить соединение с сервером.","Hostname");
        }
        
        var proxyResult = await _proxyRepository
            .AddProxyAsync(CreateProxyCommand.MapToProxy(request));

        return CreateProxyResponse.ProxyMapTo(proxyResult);
    }
}