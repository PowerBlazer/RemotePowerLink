using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToConfirmEmail;

public class SendCodeToConfirmEmailCommand: IRequest<string>
{
    /// <summary>
    /// Почта для подтверждения
    /// </summary>
    public required string Email { get; set; }
}