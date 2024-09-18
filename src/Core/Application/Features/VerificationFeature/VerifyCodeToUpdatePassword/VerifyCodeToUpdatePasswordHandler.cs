using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToUpdatePassword;

[UsedImplicitly]
public class VerifyCodeToUpdatePasswordHandler: IRequestHandler<VerifyCodeToUpdatePasswordCommand>
{
    private readonly IVerificationService _verificationService;

    public VerifyCodeToUpdatePasswordHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task Handle(VerifyCodeToUpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.VerifyCodeToUpdatePassword(request.SessionId, request.VerificationCode);
    }
}