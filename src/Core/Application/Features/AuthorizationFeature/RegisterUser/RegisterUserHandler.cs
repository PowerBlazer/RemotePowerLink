using Application.Layers.Identity;
using Application.Layers.Identity.Models.Authorization;
using AutoMapper;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.RegisterUser;

[UsedImplicitly]
public class RegisterUserHandler: IRequestHandler<RegisterUserCommand,RegistrationResponse>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IMapper _mapper;

    public RegisterUserHandler(IAuthorizationService authorizationService, 
        IMapper mapper)
    {
        _authorizationService = authorizationService;
        _mapper = mapper;
    }

    public Task<RegistrationResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var registerInput = _mapper.Map<RegisterUserCommand, RegistrationRequest>(request);

        return _authorizationService.RegisterUser(registerInput);
    }
}