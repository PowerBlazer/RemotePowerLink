using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToConfirmNewEmail;

[UsedImplicitly]
public class SendCodeToConfirmNewEmailHandler: IRequestHandler<SendCodeToConfirmNewEmailCommand, string>
{
    private readonly IVerificationService _verificationService;

    public SendCodeToConfirmNewEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(SendCodeToConfirmNewEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.SendCodeToConfirmNewEmail(request.NewEmail, request.SessionId);
    }
}