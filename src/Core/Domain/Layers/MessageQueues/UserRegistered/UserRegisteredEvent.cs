using JetBrains.Annotations;

namespace Domain.Layers.MessageQueues.UserRegistered;

[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class UserRegisteredEvent
{
    public UserRegisteredEvent(long userId,string userName)
    {
        UserId = userId;
        UserName = userName;
    }
    
    public long UserId { get; }
    public string UserName { get; }
}