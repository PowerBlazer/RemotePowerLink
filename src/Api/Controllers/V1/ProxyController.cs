using Application.Features.ProxyFeature.GetProxies;
using Domain.Common;
using Domain.DTOs.Proxy;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/proxy")]
[ApiVersion("1.0")]
public class ProxyController: BaseController
{
    public ProxyController(IMediator mediator): base(mediator)
    {
        
    }
    
    
    /// <summary>
    /// Получить список прокси пользователя
    /// </summary>
    /// <returns>Возвращает список прокси пользователя</returns>
    /// <response code="200">Возвращает прокси пользователя</response>
    /// <response code="400">Ошибка валидации данных</response>
    /// <response code="401">Пользователь не авторизован</response>
    /// <response code="500">Ошибка на сервере</response>
    [HttpGet]
    public async Task<ApiActionResult<IEnumerable<ProxyResponse>>> GetProxiesInUser()
    {
        var result = await Mediator.Send(new GetProxiesCommand(UserId));

        return new ApiActionResult<IEnumerable<ProxyResponse>>
        {
            Result = result
        };
    }
}