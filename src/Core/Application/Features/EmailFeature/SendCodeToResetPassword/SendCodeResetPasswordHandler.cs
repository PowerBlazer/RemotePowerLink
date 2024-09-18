using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.EmailFeature.SendCodeToResetPassword;

[UsedImplicitly]
public class SendCodeResetPasswordHandler: IRequestHandler<SendCodeResetPasswordCommand, string>
{
    private readonly IEmailService _emailService;

    public SendCodeResetPasswordHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public Task<string> Handle(SendCodeResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return _emailService.SendCodeResetPassword(request.UserId);
    }
}