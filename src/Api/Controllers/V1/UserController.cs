using Application.Features.UserFeature.GetUserData;
using Domain.Common;
using Domain.DTOs.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/user")]
[ApiVersion("1.0")]
public class UserController: BaseController
{
    public UserController(IMediator mediator): base(mediator)
    {
       
    }
    
    /// <summary>
    /// Получить информацию о пользователя
    /// </summary>
    /// <returns>Возвращает инфомрацию о пользователя</returns>
    /// <response code="200">Возвращает инфомрацию о пользователя</response>
    /// <response code="400">Ошибка валидации данных</response>
    /// <response code="401">Пользователь не авторизован</response>
    /// <response code="404">Пользователь не найден</response>
    /// <response code="500">Ошибка на сервере</response>
    [HttpGet]
    public async Task<ApiActionResult<UserDataResponse>> GetUserData()
    {
        var result = await Mediator.Send(new GetUserDataCommand(UserId));

        return new ApiActionResult<UserDataResponse>()
        {
            Result = result
        };
    }
   
    
}