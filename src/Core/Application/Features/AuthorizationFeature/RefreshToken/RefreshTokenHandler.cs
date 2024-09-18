using Application.Layers.Identity;
using Application.Layers.Identity.Models.Authorization;
using AutoMapper;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.RefreshToken;

[UsedImplicitly]
public class RefreshTokenHandler: IRequestHandler<RefreshTokenCommand,RefreshTokenResponse>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IMapper _mapper;

    public RefreshTokenHandler(IAuthorizationService authorizationService,
        IMapper mapper)
    {
        _authorizationService = authorizationService;
        _mapper = mapper;
    }

    public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var refreshTokenInput = _mapper.Map<RefreshTokenCommand, RefreshTokenRequest>(request);

        var result = await _authorizationService.RefreshToken(refreshTokenInput);

        return result;
    }
}