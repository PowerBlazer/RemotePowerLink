using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.IdentityFeature.CreateIdentity;

[UsedImplicitly]
public class CreateIdentityHandler: IRequestHandler<CreateIdentityCommand, CreateIdentityResponse>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IEncryptionService _encryptionService;

    public CreateIdentityHandler(IIdentityRepository identityRepository, IEncryptionService encryptionService)
    {
        _identityRepository = identityRepository;
        _encryptionService = encryptionService;
    }

    public async Task<CreateIdentityResponse> Handle(CreateIdentityCommand request, CancellationToken cancellationToken)
    {
        var newIdentity = CreateIdentityCommand.MapToIdentity(request);
        
        newIdentity.Password = _encryptionService.Encrypt(request.Password);
        
        var addedIdentityResult = await _identityRepository.AddIdentity(newIdentity);

        return CreateIdentityResponse.IdentityMapTo(addedIdentityResult);
    }
}