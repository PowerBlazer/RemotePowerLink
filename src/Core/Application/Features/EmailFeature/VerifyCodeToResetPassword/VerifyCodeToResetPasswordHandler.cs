using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.EmailFeature.VerifyCodeToResetPassword;

[UsedImplicitly]
public class VerifyCodeToResetPasswordHandler: IRequestHandler<VerifyCodeToResetPasswordCommand>
{
    private readonly IEmailService _emailService;

    public VerifyCodeToResetPasswordHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public Task Handle(VerifyCodeToResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return _emailService.VerifyResetPasswordCode(request.SessionId, request.VerificationCode);
    }
}