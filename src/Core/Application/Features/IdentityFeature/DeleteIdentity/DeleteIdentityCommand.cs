using MediatR;

namespace Application.Features.IdentityFeature.DeleteIdentity;

public class DeleteIdentityCommand: IRequest
{
    public long IdentityId { get; }
    public long UserId { get; }

    public DeleteIdentityCommand(long identityId, long userId)
    {
        IdentityId = identityId;
        UserId = userId;
    }
}