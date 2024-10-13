using MediatR;

namespace Application.Features.ProxyFeature.DeleteProxy;

public class DeleteProxyCommand: IRequest
{
    public long ProxyId { get; }
    public long UserId { get; }

    public DeleteProxyCommand(long proxyId, long userId)
    {
        ProxyId = proxyId;
        UserId = userId;
    }
}