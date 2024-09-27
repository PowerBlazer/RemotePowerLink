using Application.Layers.Persistence.Repository;
using Domain.DTOs.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.IdentityFeature.CreateIdentity;

[UsedImplicitly]
public class CreateIdentityHandler: IRequestHandler<CreateIdentityCommand, CreateIdentityResponse>
{
    private readonly IIdentityRepository _identityRepository;

    public CreateIdentityHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public async Task<CreateIdentityResponse> Handle(CreateIdentityCommand request, CancellationToken cancellationToken)
    {
        var newIdentity = CreateIdentityCommand.MapToIdentity(request);
        
        var addedIdentityResult = await _identityRepository.AddIdentity(newIdentity);

        return CreateIdentityResponse.IdentityMapTo(addedIdentityResult);
    }
}