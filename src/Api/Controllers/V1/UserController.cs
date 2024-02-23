using Application.Features.UserFeature.GetUserData;
using Domain.Common;
using Domain.DTOs.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/user")]
[ApiVersion("1.0")]
public class UserController : BaseController
{
    public UserController(IMediator mediator) : base(mediator)
    {
    }
        
    /// <summary>
    /// Получает информацию о пользователе.
    /// </summary>
    /// <returns>Информация о пользователе.</returns>
    /// <response code="200">Успешно возвращена информация о пользователе.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiActionResult<GetUserDataResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<GetUserDataResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<GetUserDataResponse>> GetUserData()
    {
        var result = await Mediator.Send(new GetUserDataCommand(UserId));

        return new ApiActionResult<GetUserDataResponse>
        {
            Result = result
        };
    }
}