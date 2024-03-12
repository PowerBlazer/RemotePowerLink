using Application.Features.ServerFeature.CreateServer;
using Application.Features.ServerFeature.DeleteServer;
using Application.Features.ServerFeature.EditServer;
using Application.Features.ServerFeature.GetServers;
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
    
    /// <summary>
    /// Получает список серверов пользователя.
    /// </summary>
    /// <returns>Список серверов пользователя.</returns>
    /// <response code="200">Успешно возвращен список серверов пользователя.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetServerResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetServerResponse>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<IEnumerable<GetServerResponse>>> GetServersInUser()
    {
        var result = await Mediator.Send(new GetServersCommand(UserId));

        return new ApiActionResult<IEnumerable<GetServerResponse>>
        {
            Result = result
        };
    }
    
    
    /// <summary>
    /// Обновляет данные сервера на основе предоставленных данных и настройки подключения SSH к удаленной машине.
    /// </summary>
    /// <param name="editServerCommand">Данные для обновления сервера и настройки подключения SSH.</param>
    /// <returns>Результат обновленного сервера.</returns>
    /// <response code="200">Сервер успешно обновлен.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("edit")]
    [ProducesResponseType(typeof(ApiActionResult<EditServerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<EditServerResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<EditServerResponse>> EditServer([FromBody]EditServerCommand editServerCommand)
    {
        editServerCommand.UserId = UserId;
        var result = await Mediator.Send(editServerCommand);

        return new ApiActionResult<EditServerResponse>
        {
            Result = result
        };
    }
    
    /// <summary>
    /// Удаляет сервер по его ServerId.
    /// </summary>
    /// <param name="serverId">Id сервера</param>
    /// <response code="200">Cервер успешно удален.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpDelete("{serverId:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<bool>> DeleteServer([FromRoute] long serverId)
    {
        await Mediator.Send(new DeleteServerCommand(serverId));

        return new ApiActionResult<bool>();
    }
}