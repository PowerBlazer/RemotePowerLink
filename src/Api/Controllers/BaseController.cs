using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class BaseController: ControllerBase
{
    protected readonly IMediator Mediator;
    public BaseController(IMediator mediator)
    {
        Mediator = mediator;
    }
    
    protected long UserId => long.Parse(User.Claims.Single(p => p.Type == ClaimTypes.NameIdentifier).Value);

    protected string? IpAddress
    {
        get
        {
            var forwardedFor = HttpContext.Request.Headers["X-Forwarded-For"].ToString();
            
            if (string.IsNullOrEmpty(forwardedFor))
                return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
            
            // В X-Forwarded-For может быть список IP-адресов, разделенных запятыми.
            // Первый IP-адрес в списке обычно является IP-адресом конечного клиента.
            var ipAddresses = forwardedFor.Split(',', StringSplitOptions.RemoveEmptyEntries);
            
            return ipAddresses.FirstOrDefault()?.Trim();

            // Если заголовок X-Forwarded-For не установлен, то пытаемся получить IP-адрес из HttpContext
        }
    }

}