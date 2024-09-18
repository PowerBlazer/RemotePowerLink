using JetBrains.Annotations;

namespace Application.Layers.MessageQueues.SendCodeToConfirmEmail;

[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class SendCodeToConfirmEmailEvent
{
    public SendCodeToConfirmEmailEvent(string email, string? confirmLink, 
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