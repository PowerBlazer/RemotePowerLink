

namespace Application.Layers.MessageQueues.VerificationEmailSend;

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