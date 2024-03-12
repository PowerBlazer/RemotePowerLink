using MediatR;

namespace Application.Features.IdentityFeature.DeleteIdentity;

public class DeleteIdentityCommand: IRequest
{
    public long IdentityId { get; }
    
    public DeleteIdentityCommand(long identityId)
    {
        IdentityId = identityId;
    }
}