using Application.Features.EncodingFeature.GetEncodings;
using Domain.Common;
using Domain.DTOs.Encoding;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;


[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/encoding")]
[ApiVersion("1.0")]
public class EncodingController: BaseController
{
    public EncodingController(IMediator mediator) : base(mediator)
    {
    }
    
    /// <summary>
    /// Получает список кодировок.
    /// </summary>
    /// <returns>Список кодировок.</returns>
    /// <response code="200">Успешно возвращен список кодировок.</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiActionResult<IEnumerable<GetEncodingResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ApiActionResult<IEnumerable<GetEncodingResponse>>> GetEncodings()
    {
        var result = await Mediator.Send(new GetEncodingsCommand());

        return new ApiActionResult<IEnumerable<GetEncodingResponse>>
        {
            Result = result
        };
    }
}