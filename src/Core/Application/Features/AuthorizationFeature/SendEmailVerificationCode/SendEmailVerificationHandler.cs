using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.SendEmailVerificationCode;

[UsedImplicitly]
public class SendEmailVerificationHandler: IRequestHandler<SendEmailVerificationCommand,string>
{
    private readonly IAuthorizationService _authorizationService;
    
    public SendEmailVerificationHandler(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    
    public Task<string> Handle(SendEmailVerificationCommand request, CancellationToken cancellationToken)
    {
        return _authorizationService.SendEmailVerificationCodeAsync(request.Email!);
    }
}