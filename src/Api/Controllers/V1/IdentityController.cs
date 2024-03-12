using Application.Features.IdentityFeature.CreateIdentity;
using Application.Features.IdentityFeature.DeleteIdentity;
using Application.Features.IdentityFeature.EditIdentity;
using Application.Features.IdentityFeature.GetIdentities;
using Domain.Common;
using Domain.DTOs.Identity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/identity")]
[ApiVersion("1.0")]
public class IdentityController : BaseController
{
    public IdentityController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Получает список идентификаторов пользователя.
    /// </summary>
    /// <returns>Список идентификаторов пользователя.</returns>
    /// <response code="200">Успешно возвращен идентификаторов данных пользователя.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetIdentityResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetIdentityResponse>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<IEnumerable<GetIdentityResponse>>> GetIdentitiesInUser()
    {
        var result = await Mediator.Send(new GetIdentitiesCommand(UserId));

        return new ApiActionResult<IEnumerable<GetIdentityResponse>>
        {
            Result = result
        };
    }
    
    /// <summary>
    /// Создает новую идентификацию для авторизации по протоколу SSH.
    /// </summary>
    /// <param name="createIdentityCommand">Данные для создания новой идентификации.</param>
    /// <returns>Результат создания новой идентификации.</returns>
    /// <response code="200">Иденитфикатор успешно созданы.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiActionResult<CreateIdentityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<CreateIdentityResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<CreateIdentityResponse>> CreateIdentity([FromBody]CreateIdentityCommand createIdentityCommand)
    {
        createIdentityCommand.UserId = UserId;
        var result = await Mediator.Send(createIdentityCommand);

        return new ApiActionResult<CreateIdentityResponse>
        {
            Result = result
        };
    }
    
    /// <summary>
    /// Обновляет данные идентификатора на основе предоставленных данных и настройки подключения SSH к удаленной машине.
    /// </summary>
    /// <param name="editIdentityCommand">Данные для обновления идентификатора и настройки подключения SSH.</param>
    /// <returns>Результат обновленного идентификатора.</returns>
    /// <response code="200">Идентификатор успешно обновлен.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpPost("edit")]
    [ProducesResponseType(typeof(ApiActionResult<EditIdentityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiActionResult<EditIdentityResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<EditIdentityResponse>> EditIdentity([FromBody]EditIdentityCommand editIdentityCommand)
    {
        editIdentityCommand.UserId = UserId;
        var result = await Mediator.Send(editIdentityCommand);

        return new ApiActionResult<EditIdentityResponse>
        {
            Result = result
        };
    }
    
    /// <summary>
    /// Удаляет идентификатор по его IdentityId.
    /// </summary>
    /// <param name="identityId">Id идентификатора</param>
    /// <response code="200">Идентификатор успешно удален.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpDelete("{identityId:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<bool>> DeleteIdentity([FromRoute]long identityId)
    {
        await Mediator.Send(new DeleteIdentityCommand(identityId));

        return new ApiActionResult<bool>();
    }

}
