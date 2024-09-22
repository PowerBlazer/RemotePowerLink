using Application.Features.UserFeature.ChangePassword;
using Application.Features.UserFeature.GetUserData;
using Application.Features.UserFeature.UpdateEmail;
using Application.Features.UserFeature.UpdateUserData;
using Application.Layers.Identity.Models.Authorization;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserData = Domain.DTOs.User.UserData;

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
    [ProducesResponseType(typeof(ApiActionResult<UserData>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<UserData>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<UserData>> GetUserData()
    {
        var result = await Mediator.Send(new GetUserDataCommand(UserId));

        return new ApiActionResult<UserData>
        {
            Result = result
        };
    }

    /// <summary>
    /// Обновляет информацию о пользователе.
    /// </summary>
    /// <returns>Обновленная информация о пользователе.</returns>
    /// <response code="200">Успешно обновлена информация о пользователе.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("update")]
    [ProducesResponseType(typeof(ApiActionResult<UserData>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<UserData>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<UserData>> UpdateUserData([FromBody]UpdateUserDataCommand updateUserDataCommand)
    {
        updateUserDataCommand.UserId = UserId;

        var result = await Mediator.Send(updateUserDataCommand);
        
        return new ApiActionResult<UserData>
        {
            Result = result
        };
    }
    
    /// <summary>
    /// Обновляет пароль у пользователя
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно обновлен пароль</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult> ChangePassword([FromBody] ChangePasswordCommand changePasswordCommand,
        CancellationToken cancellationToken)
    {
        changePasswordCommand.UserId = UserId;
        
        await Mediator.Send(changePasswordCommand, cancellationToken);

        return new ApiActionResult();
    }
    
    /// <summary>
    /// Обновляет почтовый ящик пользователя
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешна обновлена почта</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult> UpdateEmail([FromBody] UpdateEmailCommand updateEmailCommand,
        CancellationToken cancellationToken)
    {
        updateEmailCommand.UserId = UserId;
        
        await Mediator.Send(updateEmailCommand, cancellationToken);

        return new ApiActionResult();
    }
}