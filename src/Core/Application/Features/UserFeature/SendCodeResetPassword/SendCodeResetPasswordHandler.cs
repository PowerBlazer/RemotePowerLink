using Application.Layers.Identity;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.SendCodeResetPassword;

[UsedImplicitly]
public class SendCodeResetPasswordHandler: IRequestHandler<SendCodeResetPasswordCommand, string>
{
    private readonly IUserService _userService;

    public SendCodeResetPasswordHandler(IUserService userService)
    {
        _userService = userService;
    }

    public Task<string> Handle(SendCodeResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return _userService.SendCodeResetPassword(request.UserId);
    }
}