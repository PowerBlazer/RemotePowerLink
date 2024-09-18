using Domain.DTOs.Identity;
using Domain.Repository;
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
        var identityResult = await _identityRepository
            .UpdateIdentity(EditIdentityCommand.MapToIdentity(request));

        return EditIdentityResponse.IdentityMapTo(identityResult);
    }
}