using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.SendCodeToEmailVerification;

[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class SendCodeToEmailVerificationCommand: IRequest<string>
{
    /// <summary>
    /// Почта для подтверждения
    /// </summary>
    public string? Email { get; set; }
}