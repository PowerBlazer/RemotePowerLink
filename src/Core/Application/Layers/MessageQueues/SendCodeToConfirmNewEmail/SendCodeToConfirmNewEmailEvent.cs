namespace Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;

public class SendCodeToConfirmNewEmailEvent
{
    public SendCodeToConfirmNewEmailEvent(string email, string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }
    
    public string Email { get; }
    public string VerificationCode { get; }
}