using Application.Features.IdentityFeature.GetIdentities;
using Domain.Common;
using Domain.DTOs.Identity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/identity")]
[ApiVersion("1.0")]
public class IdentityController: BaseController
{
    public IdentityController(IMediator mediator): base(mediator)
    {
        
    }
    
    /// <summary>
    /// Получить список учетных данные пользователя
    /// </summary>
    /// <returns>Возвращает список учетных данных пользователя</returns>
    /// <response code="200">Возвращает список учетных данных пользователя</response>
    /// <response code="400">Ошибка валидации данных</response>
    /// <response code="401">Пользователь не авторизован</response>
    /// <response code="500">Ошибка на сервере</response>
    [HttpGet]
    public async Task<ApiActionResult<IEnumerable<IdentityResponse>>> GetIdentitiesInUser()
    {
        var result = await Mediator.Send(new GetIdentitiesCommand(UserId));

        return new ApiActionResult<IEnumerable<IdentityResponse>>
        {
            Result = result
        };
    }
}