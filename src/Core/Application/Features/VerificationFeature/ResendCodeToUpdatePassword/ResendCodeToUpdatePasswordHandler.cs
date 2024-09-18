using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToUpdatePassword;

[UsedImplicitly]
public class ResendCodeToUpdatePasswordHandler: IRequestHandler<ResendCodeToUpdatePasswordCommand, string>
{
    private readonly IVerificationService _verificationService;

    public ResendCodeToUpdatePasswordHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(ResendCodeToUpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.ResendCodeToUpdatePassword(request.SessionId, request.UserId);
    }
}