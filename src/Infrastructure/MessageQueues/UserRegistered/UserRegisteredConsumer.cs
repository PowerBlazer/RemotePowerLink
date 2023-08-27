using Application.Layers.MessageQueues.UserRegistered;
using MassTransit;

namespace MessageQueues.UserRegistered;


public class UserRegisteredConsumer: IConsumer<UserRegisteredEvent>
{
    public UserRegisteredConsumer()
    {
       
    }

    public async Task Consume(ConsumeContext<UserRegisteredEvent> context)
    {
       
    }
}