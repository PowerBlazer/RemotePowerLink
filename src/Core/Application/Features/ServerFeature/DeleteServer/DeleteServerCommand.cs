using MediatR;

namespace Application.Features.ServerFeature.DeleteServer;

public class DeleteServerCommand : IRequest
{
    public long ServerId { get; }

    public DeleteServerCommand(long serverId)
    {
        ServerId = serverId;
    }
}