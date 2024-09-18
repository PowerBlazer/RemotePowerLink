using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToConfirmNewEmail;

[UsedImplicitly]
public class VerifyCodeToConfirmNewEmailHandler: IRequestHandler<VerifyCodeToConfirmNewEmailCommand>
{
    private readonly IVerificationService _verificationService;

    public VerifyCodeToConfirmNewEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task Handle(VerifyCodeToConfirmNewEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.VerifyCodeToConfirmNewEmail(request.SessionId, request.VerificationCode);
    }
}