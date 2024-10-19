using Application.Builders.Abstract;
using Application.Services.Logic;
using Domain.Common;
using Domain.DTOs.Session;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

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

    [HttpGet("opened")]
    public ApiActionResult<IEnumerable<SessionInstanceData>> GetOpenedSessionsInUser()
    {
        var sessions = _sessionConnectionService
            .GetSessionInstancesInUser(UserId)
            .Select(p => new SessionInstanceData
            {
                Id = p.Id,
                ServerId = p.ServerId,
                UserId = p.UserId,
                DateCreated = p.DateCreated
            });

        return new ApiActionResult<IEnumerable<SessionInstanceData>>()
        {
            Result = sessions
        };
    }
    
}