using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class BaseHub: Hub
{
    protected long UserId
    {
        get
        {
            var user = Context.User;
            
            if (user is not null)
            {
                return long.Parse(user.Claims.First(p => p.Type == ClaimTypes.NameIdentifier).Value);
            }

            return long.MinValue;
        }
    }

    protected async Task HandlerOperationAsync(Func<Task> action)
    {
        try
        {
           await action(); 
        }
        catch (Exception ex)
        {
            // Обработка исключения
            await Clients
                .Client(Context.ConnectionId)
                .SendAsync("HandleError", ex.Message);
        }
    }
}