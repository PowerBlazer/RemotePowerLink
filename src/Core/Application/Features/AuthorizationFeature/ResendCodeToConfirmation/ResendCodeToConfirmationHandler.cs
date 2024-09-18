using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.ResendCodeToConfirmation;

[UsedImplicitly]
public class ResendCodeToConfirmationHandler: IRequestHandler<ResendCodeToConfirmationCommand,string>
{
    private readonly IAuthorizationService _authorizationService;

    public ResendCodeToConfirmationHandler(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    public Task<string> Handle(ResendCodeToConfirmationCommand request, CancellationToken cancellationToken)
    {
        return _authorizationService.ResendCodeToVerification(request.SessionId, request.Email);
    }
}