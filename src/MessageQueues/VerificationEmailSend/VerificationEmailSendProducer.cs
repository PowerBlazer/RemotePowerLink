using Application.Layers.MessageQueues.VerificationEmailSend;
using MassTransit;

namespace MessageQueues.VerificationEmailSend;

public class VerificationEmailSendProducer: IVerificationEmailSendProducer
{
    private readonly IBusControl _busControl;

    public VerificationEmailSendProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public async Task PublishEmailSend(VerificationEmailSendEvent verificationEmailSendEvent)
    {
       await _busControl.Publish(verificationEmailSendEvent);
    }
}