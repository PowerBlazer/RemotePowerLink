namespace Application.Layers.MessageQueues.SendCodeToUpdatePassword;

public class SendCodeToUpdatePasswordEvent
{
    public SendCodeToUpdatePasswordEvent(string email, string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }

    public string Email { get; }
    public string VerificationCode { get; }
}