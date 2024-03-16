using Domain.Layers.MessageQueues.UserRegistered;
using MassTransit;

namespace MessageQueues.UserRegistered;

public class UserRegisteredProducer: IUserRegisteredProducer
{
    private readonly IBusControl _busControl;

    public UserRegisteredProducer(IBusControl busControl)
    {
        _busControl = busControl;
    }

    public Task PublishUserRegistered(UserRegisteredEvent userRegisteredEvent)
    {
        return _busControl.Publish(userRegisteredEvent);
    }
}