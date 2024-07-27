namespace Application.Layers.MessageQueues.ResetPasswordCode;

public interface ISendResetPasswordCodeProducer
{
    Task PublishEmailSend(SendResetPasswordCodeEvent verificationEmailSendEvent);
}