namespace Application.Layers.MessageQueues.SendResetPasswordCode;

public class SendResetPasswordCodeEvent
{
    public SendResetPasswordCodeEvent(string email, string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }

    public string Email { get; }
    public string VerificationCode { get; }
}