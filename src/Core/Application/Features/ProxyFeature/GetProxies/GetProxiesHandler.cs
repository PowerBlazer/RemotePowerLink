using Application.Layers.Persistence.Repositories;
using Domain.DTOs.Proxy;
using MediatR;

namespace Application.Features.ProxyFeature.GetProxies;

public class GetProxiesHandler: IRequestHandler<GetProxiesCommand, IEnumerable<ProxyResponse>>
{
    private readonly IProxyRepository _proxyRepository;

    public GetProxiesHandler(IProxyRepository proxyRepository)
    {
        _proxyRepository = proxyRepository;
    }

    public async Task<IEnumerable<ProxyResponse>> Handle(GetProxiesCommand request, CancellationToken cancellationToken)
    {
        var proxies = await _proxyRepository.GetProxiesInUser(request.UserId);

        var proxiesResponse = proxies.Select(p => new ProxyResponse
        {
            Id = p.Id,
            Title = p.Title
        });

        return proxiesResponse;
    }
}