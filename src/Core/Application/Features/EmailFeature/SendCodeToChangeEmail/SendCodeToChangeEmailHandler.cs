using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.EmailFeature.SendCodeToChangeEmail;

[UsedImplicitly]
public class SendCodeToChangeEmailHandler: IRequestHandler<SendCodeToChangeEmailCommand, string>
{
    private readonly IEmailService _emailService;

    public SendCodeToChangeEmailHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public Task<string> Handle(SendCodeToChangeEmailCommand request, CancellationToken cancellationToken)
    {
        return _emailService.SendCodeToChangeEmail(request.UserId);
    }
}