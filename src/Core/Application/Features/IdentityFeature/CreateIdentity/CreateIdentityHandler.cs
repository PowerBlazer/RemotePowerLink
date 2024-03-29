﻿using Domain.DTOs.Identity;
using Domain.Repository;
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
        
        var addedIdentityResult = await _identityRepository.AddIdentityAsync(newIdentity);

        return CreateIdentityResponse.IdentityMapTo(addedIdentityResult);
    }
}