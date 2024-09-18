using Application.Layers.MessageQueues.SendCodeToUpdatePassword;
using MassTransit;

namespace MessageQueues.SendCodeToUpdatePassword;

public class SendCodeToUpdatePasswordProducer: ISendCodeToUpdatePasswordProducer
{
    private readonly IBusControl _busControl;

    public SendCodeToUpdatePasswordProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(SendCodeToUpdatePasswordEvent verificationEmailSendCodeToEvent)
    {
        return _busControl.Publish(verificationEmailSendCodeToEvent);
    }
}