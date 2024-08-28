using Application.Layers.MessageQueues.SendResetPasswordCode;
using MassTransit;

namespace MessageQueues.SendResetPasswordCode;

public class SendResetPasswordCodeProducer: ISendResetPasswordCodeProducer
{
    private readonly IBusControl _busControl;

    public SendResetPasswordCodeProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(SendResetPasswordCodeEvent verificationEmailSendEvent)
    {
        return _busControl.Publish(verificationEmailSendEvent);
    }
}