using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToConfirmEmail;

[UsedImplicitly]
public class ResendCodeToConfirmEmailHandler: IRequestHandler<ResendCodeToConfirmEmailCommand,string>
{
    private readonly IVerificationService _verificationService;

    public ResendCodeToConfirmEmailHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(ResendCodeToConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.ResendCodeToConfirmEmail(request.SessionId, request.Email);
    }
}