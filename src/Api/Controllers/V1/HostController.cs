
using Application.Features.ServerFeature.CreateServer;
using Domain.Common;
using Domain.DTOs.Server;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

public class HostController: BaseController
{
    public HostController(IMediator mediator): base(mediator)
    {
        
    }
    
    /// <summary>
    /// Создает новый сервер на основе предоставленных данных и настройки подключения SSH к удаленной машине.
    /// </summary>
    /// <param name="createServerCommand">Данные для создания нового сервера и настройки подключения SSH.</param>
    /// <returns>Результат создания сервера.</returns>
    /// <response code="200">Сервер успешно создан.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiActionResult<CreateServerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<CreateServerResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<CreateServerResponse>> GetIdentitiesInUser([FromBody] CreateServerCommand createServerCommand)
    {
        createServerCommand.UserId = UserId;
        var result = await Mediator.Send(createServerCommand);

        return new ApiActionResult<CreateServerResponse>
        {
            Result = result
        };
    }
}