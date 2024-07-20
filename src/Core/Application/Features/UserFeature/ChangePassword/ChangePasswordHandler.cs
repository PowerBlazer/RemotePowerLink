using Application.Layers.Identity;
using Domain.DTOs.Authorization;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.ChangePassword;

[UsedImplicitly]
public class ChangePasswordHandler: IRequestHandler<ChangePasswordCommand>
{
    private readonly IUserService _userService;

    public ChangePasswordHandler(IUserService userService)
    {
        _userService = userService;
    }

    public Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        return _userService.UpdatePassword(new UpdatePasswordRequest
        {
            PreviousPassword = request.PreviousPassword,
            NewPassword = request.NewPassword,
            UserId = request.UserId
        });
    }
}