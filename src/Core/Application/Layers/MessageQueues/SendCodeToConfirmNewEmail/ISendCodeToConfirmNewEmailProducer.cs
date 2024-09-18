namespace Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;

public interface ISendCodeToConfirmNewEmailProducer
{
    Task PublishEmailSend(SendCodeToConfirmNewEmailEvent sendCodeToConfirmNewEmailEvent);
}