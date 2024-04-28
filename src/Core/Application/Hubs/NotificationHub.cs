using Microsoft.AspNetCore.Authorization;

namespace Application.Hubs;

[Authorize]
public class NotificationHub: BaseHub
{
    public NotificationHub()
    {
        
    }
    
    
}