using Application.Services.Logic;
using Domain.Common;
using Domain.DTOs.Session;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/session")]
[ApiVersion("1.0")]
public class SessionController: BaseController
{
    private readonly SessionConnectionService _sessionConnectionService;
    public SessionController(IMediator mediator, SessionConnectionService sessionConnectionService) : base(mediator)
    {
        _sessionConnectionService = sessionConnectionService;
    }
    
    /// <summary>
    /// Получение списка открытых сессии по идентификатору пользователя
    /// </summary>
    /// <response code="200">Успешно получен список сессиии</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    /// <returns>Список открытых сессии пользователя</returns>
    [HttpGet("opened")]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<SessionInstanceData>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<SessionInstanceData>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ApiActionResult<IEnumerable<SessionInstanceData>> GetOpenedSessionsInUser()
    {
        var sessions = _sessionConnectionService
            .GetOpenedSessionsByUser(UserId)
            .Select(p => new SessionInstanceData
            {
                Id = p.Id,
                ServerId = p.ServerId,
                UserId = p.UserId,
                DateCreated = p.DateCreated
            });

        return new ApiActionResult<IEnumerable<SessionInstanceData>>
        {
            Result = sessions
        };
    }

    /// <summary>
    /// Создание сессии подключения указанного сервера
    /// </summary>
    /// <response code="200">Успешно создана сессия</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    /// <returns>Данные созданной сессии</returns>    
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiActionResult<SessionInstanceData>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<SessionInstanceData>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<SessionInstanceData>> CreateSession([FromBody] CreateSessionRequest createSessionRequest, 
        CancellationToken cancellationToken)
    {
        var sessionInstance = await _sessionConnectionService
            .CreateSessionInstance(createSessionRequest.ServerId, UserId, cancellationToken);

        return new ApiActionResult<SessionInstanceData>
        {
            Result = new SessionInstanceData
            {
                Id = sessionInstance.Id,
                DateCreated = sessionInstance.DateCreated,
                ServerId = sessionInstance.ServerId,
                UserId = sessionInstance.UserId
            }
        };
    }
    
}