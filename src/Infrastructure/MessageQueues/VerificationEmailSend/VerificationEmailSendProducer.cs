using Domain.Layers.MessageQueues.VerificationEmailSend;
using MassTransit;

namespace MessageQueues.VerificationEmailSend;

public class VerificationEmailSendProducer: IVerificationEmailSendProducer
{
    private readonly IBusControl _busControl;

    public VerificationEmailSendProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(VerificationEmailSendEvent verificationEmailSendEvent)
    {
        return _busControl.Publish(verificationEmailSendEvent);
    }
}