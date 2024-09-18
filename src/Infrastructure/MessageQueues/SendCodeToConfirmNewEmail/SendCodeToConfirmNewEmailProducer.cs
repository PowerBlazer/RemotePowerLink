using Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;
using MassTransit;

namespace MessageQueues.SendCodeToConfirmNewEmail;

public class SendCodeToConfirmNewEmailProducer: ISendCodeToConfirmNewEmailProducer
{
    private readonly IBusControl _busControl;

    public SendCodeToConfirmNewEmailProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(SendCodeToConfirmNewEmailEvent sendCodeToChangeEmailEvent)
    {
        return _busControl.Publish(sendCodeToChangeEmailEvent);
    }
}