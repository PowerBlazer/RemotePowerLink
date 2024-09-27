using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Application.Services.Abstract.Parameters;
using Domain.DTOs.Proxy;
using Domain.Exceptions;
using MediatR;

namespace Application.Features.ProxyFeature.EditProxy;

public class EditProxyHandler: IRequestHandler<EditProxyCommand,EditProxyResponse>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IServerService _serverService;
    private readonly IProxyRepository _proxyRepository;

    public EditProxyHandler(IIdentityRepository identityRepository, 
        IServerService serverService, 
        IProxyRepository proxyRepository)
    {
        _identityRepository = identityRepository;
        _serverService = serverService;
        _proxyRepository = proxyRepository;
    }

    public async Task<EditProxyResponse> Handle(EditProxyCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentityDefault(request.IdentityId);

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

        var proxy = EditProxyCommand.MapToProxy(request);
        
        var updatedProxy = await _proxyRepository.UpdateProxy(proxy);

        return EditProxyResponse.ProxyMapTo(updatedProxy);
    }
}