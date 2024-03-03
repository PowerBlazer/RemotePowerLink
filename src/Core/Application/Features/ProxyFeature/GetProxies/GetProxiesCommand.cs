using Domain.DTOs.Proxy;
using MediatR;

namespace Application.Features.ProxyFeature.GetProxies;

/// <summary>
/// Команда для получения списка прокси-серверов пользователя.
/// </summary>
public class GetProxiesCommand : IRequest<IEnumerable<GetProxyResponse>>
{
    public GetProxiesCommand(long userId)
    {
        UserId = userId;
    }
    
    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    public long UserId { get; }
}
