using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToConfirmEmail;

[UsedImplicitly]
public class VerifyCodeToConfirmEmailHandler: IRequestHandler<VerifyCodeToConfirmEmailCommand>
{
    private readonly IVerificationService _verificationService;

    public VerifyCodeToConfirmEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task Handle(VerifyCodeToConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.VerifyCodeToConfirmEmail(request.SessionId, request.VerificationCode);
    }
}