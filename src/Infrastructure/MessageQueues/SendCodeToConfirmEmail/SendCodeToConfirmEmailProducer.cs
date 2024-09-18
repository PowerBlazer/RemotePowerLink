using Application.Layers.MessageQueues.SendCodeToConfirmEmail;
using MassTransit;

namespace MessageQueues.SendCodeToConfirmEmail;

public class SendCodeToConfirmEmailProducer: ISendCodeToConfirmEmailProducer
{
    private readonly IBusControl _busControl;

    public SendCodeToConfirmEmailProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(SendCodeToConfirmEmailEvent sendCodeToConfirmEmailEvent)
    {
        return _busControl.Publish(sendCodeToConfirmEmailEvent);
    }
}