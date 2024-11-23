using Application.Features.TerminalSettingFeature.GetTerminalSettingByUser;
using Application.Features.TerminalSettingFeature.UpdateTerminalSetting;
using Application.Features.TerminalThemeFeature.GetTerminalThemes;
using Domain.Common;
using Domain.DTOs.Terminal;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/terminal")]
[ApiVersion("1.0")]
public class TerminalController: BaseController
{
    public TerminalController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Получает список тем для терминала
    /// </summary>
    /// <returns>Список тем для терминала</returns>
    /// <response code="200">Успешно возвращено.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet("themes")]
    public async Task<ApiActionResult<IEnumerable<TerminalThemeResponse>>> GetThemes()
    {
        var result = await Mediator.Send(new GetTerminalThemesCommand());

        return new ApiActionResult<IEnumerable<TerminalThemeResponse>>
        {
            Result = result
        };
    }

    /// <summary>
    /// Получает настройки терминала
    /// </summary>
    /// <returns>Настройки терминала</returns>
    /// <response code="200">Успешно возвращено.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet("setting")]
    public async Task<ApiActionResult<TerminalSettingResponse>> GetTerminalSettingByUser()
    {
        var result = await Mediator.Send(new GetTerminalSettingByUserCommand(UserId));

        return new ApiActionResult<TerminalSettingResponse>
        {
            Result = result
        };
    }

    [HttpPost("update-setting")]
    public async Task<ApiActionResult<TerminalSettingResponse>> UpdateTerminalSetting(
        [FromBody] UpdateTerminalSettingCommand updateTerminalSettingCommand)
    {
        updateTerminalSettingCommand.UserId = UserId;
        
        var result = await Mediator.Send(updateTerminalSettingCommand);

        return new ApiActionResult<TerminalSettingResponse>
        {
            Result = result
        };
    }
    
    
}