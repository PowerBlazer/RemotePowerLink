using Application.Layers.Identity;
using Application.Layers.Identity.Models;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.UpdateEmail;

[UsedImplicitly]
public class UpdateEmailHandler: IRequestHandler<UpdateEmailCommand>
{
    private readonly IEmailService _emailService;

    public UpdateEmailHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public Task Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
    {
        return _emailService.UpdateEmail(new UpdateEmailInput
        {
            UserId = request.UserId,
            SessionId = request.SessionId
        });
    }
}