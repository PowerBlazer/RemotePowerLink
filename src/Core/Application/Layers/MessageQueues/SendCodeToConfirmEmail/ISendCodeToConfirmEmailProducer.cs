namespace Application.Layers.MessageQueues.SendCodeToConfirmEmail;

public interface ISendCodeToConfirmEmailProducer
{
    Task PublishEmailSend(SendCodeToConfirmEmailEvent sendCodeToConfirmEmailEvent);
}