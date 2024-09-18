using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.VerifyEmail;

[UsedImplicitly]
public class VerifyEmailHandler: IRequestHandler<VerifyEmailCommand>
{
    private readonly IAuthorizationService _authorizationService;

    public VerifyEmailHandler(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    public Task Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
    {
        return _authorizationService.VerifyEmail(request.SessionId, request.VerificationCode);
    }
}