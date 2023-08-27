using System.Security.Claims;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class BaseController: ControllerBase
{
    internal long UserId => long.Parse(User.Claims.Single(p => p.Type == ClaimTypes.NameIdentifier).Value);

    internal string? IpAddress => HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();

}