using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToChangeEmail;

[UsedImplicitly]
public class SendCodeToChangeEmailHandler: IRequestHandler<SendCodeToChangeEmailCommand, string>
{
    private readonly IVerificationService _verificationService;

    public SendCodeToChangeEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(SendCodeToChangeEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.SendCodeToChangeEmail(request.UserId);
    }
}