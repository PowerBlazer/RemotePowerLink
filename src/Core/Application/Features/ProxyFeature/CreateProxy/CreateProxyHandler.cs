using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.DTOs.Proxy;
using Domain.Exceptions;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.ProxyFeature.CreateProxy;

[UsedImplicitly]
public class CreateProxyHandler: IRequestHandler<CreateProxyCommand, CreateProxyResponse>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IProxyRepository _proxyRepository;
    private readonly IServerService _serverService;

    public CreateProxyHandler(IIdentityRepository identityRepository,
        IProxyRepository proxyRepository, 
        IServerService serverService)
    {
        _identityRepository = identityRepository;
        _proxyRepository = proxyRepository;
        _serverService = serverService;
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
            Password = identity.Password,
            EncodingCodePage = 65001
        };
                
        var isConnection = await _serverService.CheckConnectionServer(checkConnectionServerParameter, cancellationToken);

        if (!isConnection)
        {
            throw new ConnectionServerException("Не удалось установить соединение с сервером.","Hostname");
        }
        
        var proxyResult = await _proxyRepository
            .AddProxyAsync(CreateProxyCommand.MapToProxy(request));

        return CreateProxyResponse.ProxyMapTo(proxyResult);
    }
}