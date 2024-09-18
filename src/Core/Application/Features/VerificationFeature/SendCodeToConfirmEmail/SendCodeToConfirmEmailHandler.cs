using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToConfirmEmail;

[UsedImplicitly]
public class SendCodeToConfirmEmailHandler: IRequestHandler<SendCodeToConfirmEmailCommand,string>
{
    private readonly IVerificationService _verificationService;

    public SendCodeToConfirmEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }
    
    public Task<string> Handle(SendCodeToConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.SendCodeToConfirmEmail(request.Email);
    }
}