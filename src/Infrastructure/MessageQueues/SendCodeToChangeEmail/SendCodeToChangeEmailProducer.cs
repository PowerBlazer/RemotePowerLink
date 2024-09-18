using Application.Layers.MessageQueues.SendCodeToChangeEmail;
using MassTransit;

namespace MessageQueues.SendCodeToChangeEmail;

public class SendCodeToChangeEmailProducer: ISendCodeToChangeEmailProducer
{
    private readonly IBusControl _busControl;

    public SendCodeToChangeEmailProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(SendCodeToChangeEmailEvent sendCodeToChangeEmailEvent)
    {
        return _busControl.Publish(sendCodeToChangeEmailEvent);
    }
}