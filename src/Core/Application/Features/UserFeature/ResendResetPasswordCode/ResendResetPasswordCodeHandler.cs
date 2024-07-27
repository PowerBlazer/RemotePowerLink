using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.ResendResetPasswordCode;

[UsedImplicitly]
public class ResendResetPasswordCodeHandler: IRequestHandler<ResendResetPasswordCodeCommand, string>
{
    private readonly IUserService _userService;

    public ResendResetPasswordCodeHandler(IUserService userService)
    {
        _userService = userService;
    }

    public Task<string> Handle(ResendResetPasswordCodeCommand request, CancellationToken cancellationToken)
    {
        return _userService.ResendResetPasswordCode(request.SessionId, request.UserId);
    }
}