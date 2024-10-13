using Application.Layers.Persistence.Repository;
using Domain.DTOs.Identity;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.IdentityFeature.EditIdentity;

[UsedImplicitly]
public class EditIdentityHandler: IRequestHandler<EditIdentityCommand, EditIdentityResponse>
{
    private readonly IIdentityRepository _identityRepository;

    public EditIdentityHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public async Task<EditIdentityResponse> Handle(EditIdentityCommand request, CancellationToken cancellationToken)
    {
        var identity = await _identityRepository.GetIdentity(request.IdentityId);

        if (identity.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к идентификатору с таким ${request.IdentityId} IdentityId",
                "Identity");
        }
        
        var identityResult = await _identityRepository
            .UpdateIdentity(EditIdentityCommand.MapToIdentity(request));

        return EditIdentityResponse.IdentityMapTo(identityResult);
    }
}