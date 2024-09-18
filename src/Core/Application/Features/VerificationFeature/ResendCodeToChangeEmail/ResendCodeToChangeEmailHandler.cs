using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToChangeEmail;

[UsedImplicitly]
public class ResendCodeToChangeEmailHandler: IRequestHandler<ResendCodeToChangeEmailCommand, string>
{
    private readonly IVerificationService _verificationService;

    public ResendCodeToChangeEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(ResendCodeToChangeEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.ResendCodeToChangeEmail(request.SessionId, request.UserId);
    }
}