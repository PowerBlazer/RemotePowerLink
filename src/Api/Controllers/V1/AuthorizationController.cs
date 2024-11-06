using Application.Features.AuthorizationFeature.LoginUser;
using Application.Features.AuthorizationFeature.RefreshToken;
using Application.Features.AuthorizationFeature.RegisterUser;
using Domain.Common;
using Domain.DTOs.Authorization;
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
        
        SetRefreshTokenCookie(result.RefreshToken);

        return new ApiActionResult<RegistrationResponse>
        {
            Result = new RegistrationResponse(result.AccessToken)
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

        SetRefreshTokenCookie(result.RefreshToken);

        return new ApiActionResult<LoginResponse>
        {
            Result = new LoginResponse(result.AccessToken)
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
        refreshTokenCommand.RefreshToken = GetRefreshTokenFromCookie();
        
        var result = await Mediator.Send(refreshTokenCommand);
        
        SetRefreshTokenCookie(result.RefreshToken);

        return new ApiActionResult<RefreshTokenResponse>
        {
            Result = new RefreshTokenResponse(result.AccessToken)
        };
    }
    
    
    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Expires = DateTimeOffset.UtcNow.AddDays(30),
            SameSite = SameSiteMode.Strict
        };

        HttpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    private string? GetRefreshTokenFromCookie()
    {
        return HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken) 
            ? refreshToken 
            : null;
    }
}

