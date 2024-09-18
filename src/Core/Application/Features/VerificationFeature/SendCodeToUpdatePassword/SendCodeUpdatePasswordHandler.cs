using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToUpdatePassword;

[UsedImplicitly]
public class SendCodeUpdatePasswordHandler: IRequestHandler<SendCodeUpdatePasswordCommand, string>
{
    private readonly IVerificationService _verificationService;

    public SendCodeUpdatePasswordHandler(IVerificationService verificationService)
    {
        _verificationService = verificationService;
    }

    public Task<string> Handle(SendCodeUpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        return _verificationService.SendCodeToUpdatePassword(request.UserId);
    }
}