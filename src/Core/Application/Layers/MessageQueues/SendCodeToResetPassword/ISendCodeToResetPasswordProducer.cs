namespace Application.Layers.MessageQueues.SendCodeToResetPassword;

public interface ISendCodeToResetPasswordProducer
{
    Task PublishEmailSend(SendCodeToResetPasswordEvent verificationEmailSendCodeToEvent);
}