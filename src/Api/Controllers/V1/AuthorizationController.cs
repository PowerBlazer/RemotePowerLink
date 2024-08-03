using Application.Features.AuthorizationFeature.LoginUser;
using Application.Features.AuthorizationFeature.RefreshToken;
using Application.Features.AuthorizationFeature.RegisterUser;
using Application.Features.AuthorizationFeature.ResendConfirmationCode;
using Application.Features.AuthorizationFeature.SendEmailVerificationCode;
using Application.Features.AuthorizationFeature.VerifyEmailCode;
using Application.Layers.Identity.Models.Authorization;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[ApiController]
[Route("api/v{version:apiVersion}/authorization")]
[ApiVersion("1.0")]
public class AuthorizationController : BaseController
{
    public AuthorizationController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Отправляет сообщение на почту с запросом подтверждения.
    /// </summary>
    /// <param name="verificationCommand">Данные для отправки сообщения.</param>
    /// <remarks></remarks>
    /// <returns>ID созданной сессии.</returns>
    /// <response code="200">Успешно отправлено сообщение на почту (ID сессии).</response>
    /// <response code="400">Неправильный формат почты или почта уже зарегистрирована.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("SendEmailVerification")]
    [ProducesResponseType(typeof(ApiActionResult<SendEmailVerificationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<SendEmailVerificationResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ApiActionResult<SendEmailVerificationResponse>> SendEmailVerification(
        [FromBody] SendEmailVerificationCommand verificationCommand)
    {
        var result = await Mediator.Send(verificationCommand);

        return new ApiActionResult<SendEmailVerificationResponse>
        {
            Result = new SendEmailVerificationResponse
            {
                SessionId = result
            }
        };
    }

    /// <summary>
    /// Подтверждает адрес электронной почты пользователя с использованием кода подтверждения.
    /// </summary>
    /// <param name="verifyEmailCodeCommand">Данные для подтверждения адреса электронной почты.</param>
    /// <response code="200">Успешно подтвержден адрес электронной почты.</response>
    /// <response code="400">Неправильный формат данных.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("ConfirmEmail")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task ConfirmEmailWithVerificationCode(
        [FromBody] VerifyEmailCodeCommand verifyEmailCodeCommand)
    {
        return Mediator.Send(verifyEmailCodeCommand);
    }

    /// <summary>
    /// Повторно отправляет сообщение на почту с запросом подтверждения.
    /// </summary>
    /// <param name="resendConfirmationCodeCommand">Данные для повторной отправки сообщения.</param>
    /// <returns>ID пересозданной сессии.</returns>
    /// <response code="200">Сообщение успешно отправлено на почту (ID сессии).</response>
    /// <response code="400">Неправильный формат почты.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPut("ResendEmailVerification")]
    [ProducesResponseType(typeof(ApiActionResult<ResendEmailVerificationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<ResendEmailVerificationResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ApiActionResult<ResendEmailVerificationResponse>> ResendEmailVerification(
        [FromBody] ResendConfirmationCodeCommand resendConfirmationCodeCommand)
    {
        var result = await Mediator.Send(resendConfirmationCodeCommand);

        return new ApiActionResult<ResendEmailVerificationResponse>
        {
            Result = new ResendEmailVerificationResponse
            {
                SessionId = result
            }
        };
    }

    /// <summary>
    /// Регистрирует нового пользователя.
    /// </summary>
    /// <param name="registerUserCommand">Данные для регистрации пользователя.</param>
    /// <returns>AccessToken и RefreshToken.</returns>
    /// <response code="200">Успешно зарегистрирован новый пользователь (AccessToken и RefreshToken).</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("Registration")]
    [ProducesResponseType(typeof(ApiActionResult<RegistrationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<RegistrationResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ApiActionResult<RegistrationResponse>> RegisterUser(
        [FromBody] RegisterUserCommand registerUserCommand)
    {
        registerUserCommand.IpAddress = IpAddress;
        var result = await Mediator.Send(registerUserCommand);

        return new ApiActionResult<RegistrationResponse>
        {
            Result = result
        };
    }

    /// <summary>
    /// Аутентифицирует пользователя.
    /// </summary>
    /// <param name="loginUserCommand">Данные для аутентификации пользователя.</param>
    /// <returns>AccessToken и RefreshToken.</returns>
    /// <response code="200">Успешно аутентифицирован пользователь (AccessToken и RefreshToken).</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Неправильный пароль.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("Login")]
    [ProducesResponseType(typeof(ApiActionResult<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<LoginResponse>), StatusCodes.Status400BadRequest)]
    public async Task<ApiActionResult<LoginResponse>> LoginUser([FromBody]
        LoginUserCommand loginUserCommand)
    {
        loginUserCommand.IpAddress = IpAddress;
        var result = await Mediator.Send(loginUserCommand);

        return new ApiActionResult<LoginResponse>
        {
            Result = result
        };
    }

    /// <summary>
    /// Обновляет токены доступа.
    /// </summary>
    /// <param name="refreshTokenCommand">Данные для обновления токенов.</param>
    /// <returns>AccessToken и RefreshToken.</returns>
    /// <response code="200">Успешно обновлены токены (AccessToken и RefreshToken).</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Невалидный токен.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("Refresh")]
    public async Task<ApiActionResult<RefreshTokenResponse>> RefreshToken([FromBody]
        RefreshTokenCommand refreshTokenCommand)
    {
        refreshTokenCommand.IpAddress = IpAddress;
        var result = await Mediator.Send(refreshTokenCommand);

        return new ApiActionResult<RefreshTokenResponse>
        {
            Result = result
        };
    }
}

