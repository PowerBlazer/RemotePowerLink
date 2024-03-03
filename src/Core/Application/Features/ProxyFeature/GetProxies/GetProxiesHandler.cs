using Application.Layers.Persistence.Repositories;
using Domain.DTOs.Proxy;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.ProxyFeature.GetProxies;

[UsedImplicitly]
public class GetProxiesHandler: IRequestHandler<GetProxiesCommand, IEnumerable<GetProxyResponse>>
{
    private readonly IProxyRepository _proxyRepository;

    public GetProxiesHandler(IProxyRepository proxyRepository)
    {
        _proxyRepository = proxyRepository;
    }

    public async Task<IEnumerable<GetProxyResponse>> Handle(GetProxiesCommand request, CancellationToken cancellationToken)
    {
        var proxies = await _proxyRepository.GetProxiesInUser(request.UserId);
        
        var proxiesResponse = proxies.Select(GetProxyResponse.MapProxyTo);

        return proxiesResponse;
    }
}