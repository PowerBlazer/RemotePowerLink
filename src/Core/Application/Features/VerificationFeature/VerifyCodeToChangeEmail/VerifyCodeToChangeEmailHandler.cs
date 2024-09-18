using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToChangeEmail;

[UsedImplicitly]
public class VerifyCodeToChangeEmailHandler: IRequestHandler<VerifyCodeToChangeEmailCommand>
{
    private readonly IVerificationService _verificationService;

    public VerifyCodeToChangeEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task Handle(VerifyCodeToChangeEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.VerifyCodeToChangeEmail(request.SessionId, request.VerificationCode);
    }
}