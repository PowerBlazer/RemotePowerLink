using Domain.Repository;
using MediatR;

namespace Application.Features.ProxyFeature.DeleteProxy;

public class DeleteProxyHandler: IRequestHandler<DeleteProxyCommand>
{
    private readonly IProxyRepository _proxyRepository;

    public DeleteProxyHandler(IProxyRepository proxyRepository)
    {
        _proxyRepository = proxyRepository;
    }

    public Task Handle(DeleteProxyCommand request, CancellationToken cancellationToken)
    {
        return _proxyRepository.DeleteProxy(request.ProxyId);
    }
}