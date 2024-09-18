using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.IdentityFeature.DeleteIdentity;

[UsedImplicitly]
public class DeleteIdentityHandler: IRequestHandler<DeleteIdentityCommand>
{
    private readonly IIdentityRepository _identityRepository;

    public DeleteIdentityHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public Task Handle(DeleteIdentityCommand request, CancellationToken cancellationToken)
    {
        return _identityRepository.DeleteIdentity(request.IdentityId);
    }
}