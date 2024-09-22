using Application.Features.VerificationFeature.ResendCodeToChangeEmail;
using Application.Features.VerificationFeature.ResendCodeToConfirmEmail;
using Application.Features.VerificationFeature.ResendCodeToConfirmNewEmail;
using Application.Features.VerificationFeature.ResendCodeToUpdatePassword;
using Application.Features.VerificationFeature.SendCodeToChangeEmail;
using Application.Features.VerificationFeature.SendCodeToConfirmEmail;
using Application.Features.VerificationFeature.SendCodeToConfirmNewEmail;
using Application.Features.VerificationFeature.SendCodeToUpdatePassword;
using Application.Features.VerificationFeature.VerifyCodeToChangeEmail;
using Application.Features.VerificationFeature.VerifyCodeToConfirmEmail;
using Application.Features.VerificationFeature.VerifyCodeToConfirmNewEmail;
using Application.Features.VerificationFeature.VerifyCodeToUpdatePassword;
using Application.Layers.Identity.Models.Verification;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/verification")]
[ApiVersion("1.0")]
public class VerificationController: BaseController
{
    public VerificationController(IMediator mediator) : base(mediator)
    {
    }

    #region Password

    /// <summary>
    /// Повторно отправляет код для сброса пароля пользователя
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно повторно отправлен код для сброса пароля</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("ResendCodeToUpdatePassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<ResendCodeToUpdatePasswordResponse>> ResendCodeToUpdatePassword([FromBody] ResendCodeToUpdatePasswordCommand resendCodeToUpdatePasswordCommand,
        CancellationToken cancellationToken)
    {
        resendCodeToUpdatePasswordCommand.UserId = UserId;
        
        var result = await Mediator.Send(resendCodeToUpdatePasswordCommand, cancellationToken);

        return new ApiActionResult<ResendCodeToUpdatePasswordResponse>
        {
            Result = new ResendCodeToUpdatePasswordResponse
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
    [HttpPost("SendCodeToUpdatePassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<SendCodeToUpdatePasswordResponse>> SendCodeToResetPassword(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new SendCodeUpdatePasswordCommand
        {
            UserId = UserId
        }, cancellationToken);

        return new ApiActionResult<SendCodeToUpdatePasswordResponse>
        {
            Result = new SendCodeToUpdatePasswordResponse
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
    [HttpPost("VerifyCodeToUpdatePassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult> VerifyCodeToResetPassword([FromBody] VerifyCodeToUpdatePasswordCommand verifyCodeToUpdatePasswordCommand,
        CancellationToken cancellationToken)
    {
        await Mediator.Send(verifyCodeToUpdatePasswordCommand, cancellationToken);

        return new ApiActionResult();
    }

    #endregion

    #region ConfirmEmail

    /// <summary>
    /// Отправляет сообщение на почту с запросом подтверждения.
    /// </summary>
    /// <param name="command">Данные для отправки сообщения.</param>
    /// <remarks></remarks>
    /// <returns>ID созданной сессии.</returns>
    /// <response code="200">Успешно отправлено сообщение на почту (ID сессии).</response>
    /// <response code="400">Неправильный формат почты или почта уже зарегистрирована.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [AllowAnonymous]
    [HttpPost("SendCodeToConfirmEmail")]
    [ProducesResponseType(typeof(ApiActionResult<SendCodeToConfirmEmailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<SendCodeToConfirmEmailResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ApiActionResult<SendCodeToConfirmEmailResponse>> SendCodeToEmailVerification(
        [FromBody] SendCodeToConfirmEmailCommand command)
    {
        var result = await Mediator.Send(command);

        return new ApiActionResult<SendCodeToConfirmEmailResponse>
        {
            Result = new SendCodeToConfirmEmailResponse
            {
                SessionId = result
            }
        };
    }

    /// <summary>
    /// Подтверждает адрес электронной почты пользователя с использованием кода подтверждения.
    /// </summary>
    /// <param name="verifyCodeToConfirmEmailCommand">Данные для подтверждения адреса электронной почты.</param>
    /// <response code="200">Успешно подтвержден адрес электронной почты.</response>
    /// <response code="400">Неправильный формат данных.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [AllowAnonymous]
    [HttpPut("VerifyCodeToConfirmEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task VerifyCodeToConfirmEmail(
        [FromBody] VerifyCodeToConfirmEmailCommand verifyCodeToConfirmEmailCommand)
    {
        return Mediator.Send(verifyCodeToConfirmEmailCommand);
    }

    /// <summary>
    /// Повторно отправляет сообщение на почту с запросом подтверждения.
    /// </summary>
    /// <param name="resendCodeToConfirmEmailCommand">Данные для повторной отправки сообщения.</param>
    /// <returns>ID пересозданной сессии.</returns>
    /// <response code="200">Сообщение успешно отправлено на почту (ID сессии).</response>
    /// <response code="400">Неправильный формат почты.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [AllowAnonymous]
    [HttpPut("ResendCodeToConfirmEmail")]
    [ProducesResponseType(typeof(ApiActionResult<ResendCodeToConfirmEmailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<ResendCodeToConfirmEmailResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ApiActionResult<ResendCodeToConfirmEmailResponse>> ResendEmailVerification(
        [FromBody] ResendCodeToConfirmEmailCommand resendCodeToConfirmEmailCommand)
    {
        var result = await Mediator.Send(resendCodeToConfirmEmailCommand);

        return new ApiActionResult<ResendCodeToConfirmEmailResponse>
        {
            Result = new ResendCodeToConfirmEmailResponse
            {
                SessionId = result
            }
        };
    }

    #endregion

    #region ChangeEmail
    
    /// <summary>
    /// Отправляет код подтверждения для изменения теущей почты
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно отправлен код на изменеия почтового ящика</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("SendCodeToChangeEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<SendCodeToChangeEmailResponse>> SendCodeToChangeEmail(CancellationToken cancellationToken)
    {
        var sendCodeToChangeEmailCommand = new SendCodeToChangeEmailCommand
        {
            UserId = UserId
        };
        
        var result = await Mediator.Send(sendCodeToChangeEmailCommand, cancellationToken);

        return new ApiActionResult<SendCodeToChangeEmailResponse>
        {
            Result = new SendCodeToChangeEmailResponse
            {
                SessionId = result
            }
        };
    }
    
    /// <summary>
    /// Переотправляет код подтверждения для изменения теущей почты
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно переотправлен код на изменеия почтового ящика</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("ResendCodeToChangeEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<ResendCodeToChangeEmailResponse>> ResendCodeToChangeEmail([FromBody] ResendCodeToChangeEmailCommand resendCodeToChangeEmailCommand,
        CancellationToken cancellationToken)
    {
        resendCodeToChangeEmailCommand.UserId = UserId;
        
        var result = await Mediator.Send(resendCodeToChangeEmailCommand, cancellationToken);

        return new ApiActionResult<ResendCodeToChangeEmailResponse>
        {
            Result = new ResendCodeToChangeEmailResponse
            {
                SessionId = result
            }
        };
    }
    
    /// <summary>
    /// Подтверждает изменения почтового ящика пользователя.
    /// </summary>
    /// <param name="verifyCodeToChangeEmailCommand">Данные для подтверждения изменения адреса электронной почты.</param>
    /// <response code="200">Успешно подтвержден изменение адреса электронной почты.</response>
    /// <response code="400">Неправильный формат данных.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("VerifyCodeToChangeEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task VerifyCodeToChangeEmail(
        [FromBody] VerifyCodeToChangeEmailCommand verifyCodeToChangeEmailCommand)
    {
        return Mediator.Send(verifyCodeToChangeEmailCommand);
    }
    
    #endregion

    #region ConfirmNewEmail

    /// <summary>
    /// Отправляет код подтверждения для верификации нового электронного ящика
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно отправлен код</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("SendCodeToConfirmNewEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<SendCodeToConfirmNewEmailResponse>> SendCodeToConfirmNewEmail(
        [FromBody]SendCodeToConfirmNewEmailCommand sendCodeToConfirmNewEmailCommand,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(sendCodeToConfirmNewEmailCommand, cancellationToken);

        return new ApiActionResult<SendCodeToConfirmNewEmailResponse>
        {
            Result = new SendCodeToConfirmNewEmailResponse
            {
                SessionId = result
            }
        };
    }
    
    /// <summary>
    /// Переотправляет код подтверждения для верификации нового электронного ящика
    /// </summary>
    /// <returns></returns>
    /// <response code="200">Успешно переотправлен код</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="404">Пользователь не найден.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("ResendCodeToConfirmNewEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ApiActionResult<ResendCodeToConfirmNewEmailResponse>> ResendCodeToConfirmNewEmail(
        [FromBody] ResendCodeToConfirmNewEmailCommand resendCodeToConfirmNewEmailCommand,
        CancellationToken cancellationToken)
    {
        
        var result = await Mediator.Send(resendCodeToConfirmNewEmailCommand, cancellationToken);

        return new ApiActionResult<ResendCodeToConfirmNewEmailResponse>
        {
            Result = new ResendCodeToConfirmNewEmailResponse
            {
                SessionId = result
            }
        };
    }
    
    /// <summary>
    /// Подтверждает верификацию нового почтового ящика.
    /// </summary>
    /// <param name="verifyCodeToConfirmNewEmailCommand">Данные для подтверждения верификации нового почтового ящика</param>
    /// <response code="200">Успешно подтвержден верификациия нового почтового ящика</response>
    /// <response code="400">Неправильный формат данных.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("VerifyCodeToConfirmNewEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task VerifyCodeToConfirmNewEmail(
        [FromBody] VerifyCodeToConfirmNewEmailCommand verifyCodeToConfirmNewEmailCommand)
    {
        return Mediator.Send(verifyCodeToConfirmNewEmailCommand);
    }

    #endregion
}