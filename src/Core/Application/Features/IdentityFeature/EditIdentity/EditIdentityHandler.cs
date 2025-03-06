using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Domain.DTOs.Identity;
using Domain.Exceptions;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.IdentityFeature.EditIdentity;

[UsedImplicitly]
public class EditIdentityHandler: IRequestHandler<EditIdentityCommand, EditIdentityResponse>
{
    private readonly IIdentityRepository _identityRepository;
    private readonly IEncryptionService _encryptionService;

    public EditIdentityHandler(IIdentityRepository identityRepository, 
        IEncryptionService encryptionService)
    {
        _identityRepository = identityRepository;
        _encryptionService = encryptionService;
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

        var updateIdentity = EditIdentityCommand.MapToIdentity(request);
        
        updateIdentity.Password = _encryptionService.Encrypt(request.Password);
        
        var identityResult = await _identityRepository.UpdateIdentity(updateIdentity);

        return EditIdentityResponse.IdentityMapTo(identityResult);
    }
}