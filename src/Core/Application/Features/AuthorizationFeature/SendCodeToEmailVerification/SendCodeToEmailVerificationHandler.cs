using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.SendCodeToEmailVerification;

[UsedImplicitly]
public class SendCodeToEmailVerificationHandler: IRequestHandler<SendCodeToEmailVerificationCommand,string>
{
    private readonly IAuthorizationService _authorizationService;
    
    public SendCodeToEmailVerificationHandler(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    
    public Task<string> Handle(SendCodeToEmailVerificationCommand request, CancellationToken cancellationToken)
    {
        return _authorizationService.SendCodeToEmailVerification(request.Email!);
    }
}