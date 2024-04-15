using Application.Features.SftpFeature.CreateDirectory;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/sftp")]
[ApiVersion("1.0")]
public class SftpController: BaseController
{
    public SftpController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Создает новую директорию на удаленном сервере
    /// </summary>
    /// <param name="createDirectoryCommand"></param>
    /// <response code="200">Директория успешно создана.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="403">Доступ запрещен</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("create-directory")]
    public async Task<ApiActionResult> CreateDirectory([FromBody] CreateDirectoryCommand createDirectoryCommand)
    {
        createDirectoryCommand.UserId = UserId;
        await Mediator.Send(createDirectoryCommand);

        return new ApiActionResult();
    }
    
}