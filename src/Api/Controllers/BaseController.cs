using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

public class BaseController: ControllerBase
{
    internal long UserId => long.Parse(User.Claims.Single(p => p.Type == ClaimTypes.NameIdentifier).Value);

}