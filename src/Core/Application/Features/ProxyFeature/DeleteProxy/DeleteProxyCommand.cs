using MediatR;

namespace Application.Features.ProxyFeature.DeleteProxy;

public class DeleteProxyCommand: IRequest
{
    public long ProxyId { get; }

    public DeleteProxyCommand(long proxyId)
    {
        ProxyId = proxyId;
    }
}