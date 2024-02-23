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
public class IdentityController : BaseController
{
    public IdentityController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Получает список учетных данных пользователя.
    /// </summary>
    /// <returns>Список учетных данных пользователя.</returns>
    /// <response code="200">Успешно возвращен список учетных данных пользователя.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetIdentityResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetIdentityResponse>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<IEnumerable<GetIdentityResponse>>> GetIdentitiesInUser()
    {
        var result = await Mediator.Send(new GetIdentitiesCommand(UserId));

        return new ApiActionResult<IEnumerable<GetIdentityResponse>>
        {
            Result = result
        };
    }
}
