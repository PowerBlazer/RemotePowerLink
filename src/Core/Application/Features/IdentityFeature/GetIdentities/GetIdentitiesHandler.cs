﻿using Application.Layers.Persistence.Repositories;
using Domain.DTOs.Identity;
using MediatR;

namespace Application.Features.IdentityFeature.GetIdentities;

public class GetIdentitiesHandler: IRequestHandler<GetIdentitiesCommand, IEnumerable<IdentityResponse>>
{
    private readonly IIdentityRepository _identityRepository;

    public GetIdentitiesHandler(IIdentityRepository identityRepository)
    {
        _identityRepository = identityRepository;
    }

    public async Task<IEnumerable<IdentityResponse>> Handle(GetIdentitiesCommand request, CancellationToken cancellationToken)
    {
        var identities = await _identityRepository
            .GetIdentitiesInUser(request.UserId);

        var identitiesResponse = identities
            .Select(p => new IdentityResponse
            {
                Id = p.Id,
                Title = p.Title
            });

        return identitiesResponse;
    }
}