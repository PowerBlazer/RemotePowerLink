using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.EmailFeature.ResendCodeToResetPassword;

[UsedImplicitly]
public class ResendCodeToResetPasswordHandler: IRequestHandler<ResendCodeToResetPasswordCommand, string>
{
    private readonly IEmailService _emailService;

    public ResendCodeToResetPasswordHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public Task<string> Handle(ResendCodeToResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return _emailService.ResendResetPasswordCode(request.SessionId, request.UserId);
    }
}