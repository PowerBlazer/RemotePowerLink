namespace Application.Layers.MessageQueues.SendCodeToChangeEmail;

public interface ISendCodeToChangeEmailProducer
{
    Task PublishEmailSend(SendCodeToChangeEmailEvent sendCodeToChangeEmailEvent);
}