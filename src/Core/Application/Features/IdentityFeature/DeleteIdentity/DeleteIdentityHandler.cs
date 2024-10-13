using Application.Layers.Persistence.Repository;
using Domain.Exceptions;
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

    public async Task Handle(DeleteIdentityCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentity(request.IdentityId);

        if (identity.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к идентификатору с таким ${request.IdentityId} IdentityId",
                "Identity");
        }
        
        await _identityRepository.DeleteIdentity(request.IdentityId);
    }
}