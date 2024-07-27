namespace Application.Layers.MessageQueues.ResetPasswordCode;

public class SendResetPasswordCodeEvent
{
    public SendResetPasswordCodeEvent(string email,
        string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }

    public string Email { get; }
    public string VerificationCode { get; }
}