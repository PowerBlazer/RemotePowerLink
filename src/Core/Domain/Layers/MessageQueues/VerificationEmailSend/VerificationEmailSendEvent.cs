

using JetBrains.Annotations;

namespace Domain.Layers.MessageQueues.VerificationEmailSend;

[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class VerificationEmailSendEvent
{
    public VerificationEmailSendEvent(string email, string? confirmLink, 
        string verificationCode)
    {
        Email = email;
        ConfirmLink = confirmLink;
        VerificationCode = verificationCode;
    }

    public string Email { get; }
    public string? ConfirmLink { get; }
    public string VerificationCode { get; }
}