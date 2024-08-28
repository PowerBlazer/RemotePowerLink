namespace Application.Layers.MessageQueues.SendResetPasswordCode;

public interface ISendResetPasswordCodeProducer
{
    Task PublishEmailSend(SendResetPasswordCodeEvent verificationEmailSendEvent);
}