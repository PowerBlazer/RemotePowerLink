using Application.Features.ProxyFeature.CreateProxy;
using Application.Features.ProxyFeature.EditProxy;
using Application.Features.ProxyFeature.GetProxies;
using Domain.Common;
using Domain.DTOs.Proxy;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/proxy")]
[ApiVersion("1.0")]
public class ProxyController : BaseController
{
    public ProxyController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Получает список прокси пользователя.
    /// </summary>
    /// <returns>Список прокси пользователя.</returns>
    /// <response code="200">Успешно возвращен список прокси пользователя.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetProxyResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetProxyResponse>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<IEnumerable<GetProxyResponse>>> GetProxiesInUser()
    {
        var result = await Mediator.Send(new GetProxiesCommand(UserId));

        return new ApiActionResult<IEnumerable<GetProxyResponse>>
        {
            Result = result
        };
    }
    
    /// <summary>
    /// Создает новый прокси на основе предоставленных данных и настройки подключения SSH к удаленной машине.
    /// </summary>
    /// <param name="createProxyResponse">Данные для создания нового прокси и настройки подключения SSH.</param>
    /// <returns>Результат создания прокси.</returns>
    /// <response code="200">Прокси успешно создан.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiActionResult<CreateProxyResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<CreateProxyResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<CreateProxyResponse>> CreateProxy([FromBody]CreateProxyCommand createProxyResponse)
    {
        createProxyResponse.UserId = UserId;
        var result = await Mediator.Send(createProxyResponse);

        return new ApiActionResult<CreateProxyResponse>
        {
            Result = result
        };
    }
    
    
    /// <summary>
    /// Обновляет данные прокси-сервера на основе предоставленных данных и настройки подключения SSH к удаленной машине.
    /// </summary>
    /// <param name="editServerCommand">Данные для обновления прокси-сервера и настройки подключения SSH.</param>
    /// <returns>Результат обновленного прокси-сервера.</returns>
    /// <response code="200">Прокси-сервер успешно обновлен.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("edit")]
    [ProducesResponseType(typeof(ApiActionResult<EditProxyResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<EditProxyResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<EditProxyResponse>> EditProxy([FromBody]EditProxyCommand editServerCommand)
    {
        editServerCommand.UserId = UserId;
        var result = await Mediator.Send(editServerCommand);

        return new ApiActionResult<EditProxyResponse>
        {
            Result = result
        };
    }
}