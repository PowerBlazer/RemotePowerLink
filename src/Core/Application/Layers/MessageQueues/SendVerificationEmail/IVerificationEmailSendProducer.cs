namespace Application.Layers.MessageQueues.SendVerificationEmail;

public interface IVerificationEmailSendProducer
{
    Task PublishEmailSend(VerificationEmailSendEvent verificationEmailSendEvent);
}