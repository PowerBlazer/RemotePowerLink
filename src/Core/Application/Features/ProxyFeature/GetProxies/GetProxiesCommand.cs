using Domain.DTOs.Proxy;
using MediatR;

namespace Application.Features.ProxyFeature.GetProxies;

public record GetProxiesCommand(long UserId) : IRequest<IEnumerable<ProxyResponse>>;
