using Application.Layers.MessageQueues.SendCodeToResetPassword;
using MassTransit;

namespace MessageQueues.SendCodeToResetPassword;

public class SendCodeToToResetPasswordProducer: ISendCodeToResetPasswordProducer
{
    private readonly IBusControl _busControl;

    public SendCodeToToResetPasswordProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishEmailSend(SendCodeToResetPasswordEvent verificationEmailSendCodeToEvent)
    {
        return _busControl.Publish(verificationEmailSendCodeToEvent);
    }
}