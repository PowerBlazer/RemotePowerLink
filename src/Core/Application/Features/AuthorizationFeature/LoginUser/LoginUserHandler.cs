using Application.Layers.Identity;
using Application.Layers.Identity.Models.Authorization;
using AutoMapper;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.LoginUser;

[UsedImplicitly]
public class LoginUserHandler: IRequestHandler<LoginUserCommand,LoginResponse>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IMapper _mapper;

    public LoginUserHandler(IAuthorizationService authorizationService, 
        IMapper mapper)
    {
        _authorizationService = authorizationService;
        _mapper = mapper;
    }

    public Task<LoginResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var loginInput = _mapper.Map<LoginUserCommand,LoginRequest>(request);

        return _authorizationService.LoginUser(loginInput);
    }
}