namespace Application.Layers.MessageQueues.SendCodeToChangeEmail;

public class SendCodeToChangeEmailEvent
{
    public SendCodeToChangeEmailEvent(string email, string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }
    
    public string Email { get; }
    public string VerificationCode { get; }
}