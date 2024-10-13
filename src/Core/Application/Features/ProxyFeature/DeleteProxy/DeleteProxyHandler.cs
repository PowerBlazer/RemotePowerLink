using Application.Layers.Persistence.Repository;
using Domain.Exceptions;
using MediatR;

namespace Application.Features.ProxyFeature.DeleteProxy;

public class DeleteProxyHandler: IRequestHandler<DeleteProxyCommand>
{
    private readonly IProxyRepository _proxyRepository;

    public DeleteProxyHandler(IProxyRepository proxyRepository)
    {
        _proxyRepository = proxyRepository;
    }

    public async Task Handle(DeleteProxyCommand request, CancellationToken cancellationToken)
    {
        var proxy = await _proxyRepository.GetProxy(request.ProxyId);

        if (proxy.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к прокси с таким ${request.ProxyId} ProxyId",
                "Proxy");
        }
        
        await _proxyRepository.DeleteProxy(request.ProxyId);
    }
}