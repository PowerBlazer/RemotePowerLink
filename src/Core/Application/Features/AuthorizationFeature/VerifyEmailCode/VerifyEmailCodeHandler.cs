using Domain.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.VerifyEmailCode;

[UsedImplicitly]
public class VerifyEmailCodeHandler: IRequestHandler<VerifyEmailCodeCommand>
{
    private readonly IAuthorizationService _authorizationService;

    public VerifyEmailCodeHandler(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    public Task Handle(VerifyEmailCodeCommand request, CancellationToken cancellationToken)
    {
        return _authorizationService.VerifyEmailCodeAsync(request.SessionId, request.VerificationCode);
    }
}