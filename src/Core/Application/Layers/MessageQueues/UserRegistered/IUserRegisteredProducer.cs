namespace Application.Layers.MessageQueues.UserRegistered;

public interface IUserRegisteredProducer
{
    Task PublishUserRegistered(UserRegisteredEvent userRegisteredEvent);
}