namespace Application.Layers.MessageQueues.SendCodeToResetPassword;

public class SendCodeToResetPasswordEvent
{
    public SendCodeToResetPasswordEvent(string email, string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }

    public string Email { get; }
    public string VerificationCode { get; }
}