﻿
using Application.Features.ServerFeature.CreateServer;
using Domain.Common;
using Domain.DTOs.Server;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/server")]
[ApiVersion("1.0")]
public class ServerController: BaseController
{
    public ServerController(IMediator mediator): base(mediator)
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
    public async Task<ApiActionResult<CreateServerResponse>> CreateServer([FromBody]CreateServerCommand createServerCommand)
    {
        createServerCommand.UserId = UserId;
        var result = await Mediator.Send(createServerCommand);

        return new ApiActionResult<CreateServerResponse>
        {
            Result = result
        };
    }
}