using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToConfirmNewEmail;

[UsedImplicitly]
public class ResendCodeToConfirmNewEmailHandler: IRequestHandler<ResendCodeToConfirmNewEmailCommand, string>
{
    private readonly IVerificationService _verificationService;

    public ResendCodeToConfirmNewEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(ResendCodeToConfirmNewEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.ResendCodeToConfirmNewEmail(request.SessionId, request.NewEmail);
    }
}