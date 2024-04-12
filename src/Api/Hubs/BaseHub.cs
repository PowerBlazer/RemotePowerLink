using System.Security.Claims;
using Domain.Exceptions;
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

    protected string ConnectionKey => Context.ConnectionId;

    protected async Task HandlerOperationAsync(Func<Task> action)
    {
        try
        {
            await action();
        }
        catch (ConnectionServerException ex)
        {
            await Clients
                .Client(Context.ConnectionId)
                .SendAsync("HandleError", ex.Errors);
        }
        catch (Exception ex)
        {
            // Обработка исключения
            await Clients
                .Client(Context.ConnectionId)
                .SendAsync("HandleError", new Dictionary<string, List<string>>
                {
                    {
                        "Common",
                        new List<string> { ex.Message }
                    }
                });
        }
    }
}