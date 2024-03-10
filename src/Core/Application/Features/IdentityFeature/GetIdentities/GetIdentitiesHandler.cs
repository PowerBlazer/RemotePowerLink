using Domain.DTOs.Identity;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.IdentityFeature.GetIdentities;

[UsedImplicitly]
public class GetIdentitiesHandler: IRequestHandler<GetIdentitiesCommand, IEnumerable<GetIdentityResponse>>
{
    private readonly IIdentityRepository _identityRepository;

    public GetIdentitiesHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public async Task<IEnumerable<GetIdentityResponse>> Handle(GetIdentitiesCommand request, CancellationToken cancellationToken)
    {
        var identities = await _identityRepository
            .GetIdentitiesInUser(request.UserId);

        var identitiesResponse = identities.Select(GetIdentityResponse.MapIdentityTo);

        return identitiesResponse;
    }
}