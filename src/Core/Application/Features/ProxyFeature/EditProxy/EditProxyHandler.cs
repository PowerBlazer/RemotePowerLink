using Application.Layers.Persistence.Repositories;
using Application.Layers.Persistence.Services;
using Application.Layers.Persistence.Services.Parameters;
using Domain.DTOs.Proxy;
using Domain.Exceptions;
using MediatR;

namespace Application.Features.ProxyFeature.EditProxy;

public class EditProxyHandler: IRequestHandler<EditProxyCommand,EditProxyResponse>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IHostService _hostService;
    private readonly IProxyRepository _proxyRepository;

    public EditProxyHandler(IIdentityRepository identityRepository, 
        IHostService hostService, 
        IProxyRepository proxyRepository)
    {
        _identityRepository = identityRepository;
        _hostService = hostService;
        _proxyRepository = proxyRepository;
    }

    public async Task<EditProxyResponse> Handle(EditProxyCommand request, CancellationToken cancellationToken)
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

        var proxy = EditProxyCommand.MapToProxy(request);
        
        var updatedProxy = await _proxyRepository.UpdateProxyAsync(proxy);

        return EditProxyResponse.ProxyMapTo(updatedProxy);
    }
}