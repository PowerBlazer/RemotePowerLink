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

    protected string? IpAddress => HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();

}