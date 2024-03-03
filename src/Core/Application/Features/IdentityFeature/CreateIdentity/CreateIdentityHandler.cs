using Application.Layers.Persistence.Repositories;
using Domain.DTOs.Identity;
using Domain.Entities;
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
        var addedIdentityResult = await _identityRepository.AddIdentityAsync(new Identity
        {
            Title = request.Title,
            Username = request.Username,
            Password = request.Password,
            DateCreated = DateTime.Now,
            UserId = request.UserId
        });

        return CreateIdentityResponse.MapToIdentity(addedIdentityResult);
    }
}