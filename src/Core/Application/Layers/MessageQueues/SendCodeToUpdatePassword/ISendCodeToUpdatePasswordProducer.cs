namespace Application.Layers.MessageQueues.SendCodeToUpdatePassword;

public interface ISendCodeToUpdatePasswordProducer
{
    Task PublishEmailSend(SendCodeToUpdatePasswordEvent verificationEmailSendCodeToEvent);
}