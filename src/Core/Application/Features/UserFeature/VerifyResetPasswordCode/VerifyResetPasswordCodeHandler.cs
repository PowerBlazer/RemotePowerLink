using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.VerifyResetPasswordCode;

[UsedImplicitly]
public class VerifyResetPasswordCodeHandler: IRequestHandler<VerifyResetPasswordCodeCommand>
{
    private readonly IUserService _userService;

    public VerifyResetPasswordCodeHandler(IUserService userService)
    {
        _userService = userService;
    }

    public Task Handle(VerifyResetPasswordCodeCommand request, CancellationToken cancellationToken)
    {
        return _userService.VerifyResetPasswordCode(request.SessionId, request.VerificationCode);
    }
}