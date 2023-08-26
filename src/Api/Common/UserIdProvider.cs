using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Api.Common;

public class UserIdProvider: IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        var id = connection.User.Claims
            .FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier)?.Value;

        return id;
    }
}