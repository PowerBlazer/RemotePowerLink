using MediatR;

namespace Application.Features.ServerFeature.DeleteServer;

public class DeleteServerCommand : IRequest
{
    public long ServerId { get; }
    public long UserId { get; }

    public DeleteServerCommand(long serverId, long userId)
    {
        ServerId = serverId;
        UserId = userId;
    }
}