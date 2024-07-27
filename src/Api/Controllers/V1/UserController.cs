using Application.Features.UserFeature.ChangePassword;
using Application.Features.UserFeature.GetUserData;
using Application.Features.UserFeature.ResendResetPasswordCode;
using Application.Features.UserFeature.SendCodeResetPassword;
using Application.Features.UserFeature.VerifyResetPasswordCode;
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
    /// Повторно отправляет код для сброса пароля пользователя
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно повторно отправлен код для сброса пароля</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("ResendResetPasswordCode")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<ResendResetPasswordCodeResponse>> ResendResetPasswordCode([FromBody] ResendResetPasswordCodeCommand resendResetPasswordCodeCommand,
        CancellationToken cancellationToken)
    {
        resendResetPasswordCodeCommand.UserId = UserId;
        
        var result = await Mediator.Send(resendResetPasswordCodeCommand, cancellationToken);

        return new ApiActionResult<ResendResetPasswordCodeResponse>
        {
            Result = new ResendResetPasswordCodeResponse
            {
                SessionId = result
            }
        };
    }
    
    /// <summary>
    /// Отправляет код потдверждения для сброса пароля пользователя
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно отправлен код потдверждения</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("SendCodeResetPassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<SendCodeResetPasswordResponse>> SendCodeResetPassword(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new SendCodeResetPasswordCommand
        {
            UserId = UserId
        }, cancellationToken);

        return new ApiActionResult<SendCodeResetPasswordResponse>
        {
            Result = new SendCodeResetPasswordResponse
            {
                SessionId = result
            }
        };
    }
    
    /// <summary>
    /// Подтверждает операцию сброса пароля пользователя
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно подтвержден</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="400">Неправильный код верификации</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("VerifyResetPasswordCode")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult> VerifyResetPasswordCode([FromBody] VerifyResetPasswordCodeCommand verifyResetPasswordCodeCommand,
        CancellationToken cancellationToken)
    {
        await Mediator.Send(verifyResetPasswordCodeCommand, cancellationToken);

        return new ApiActionResult();
    }
}