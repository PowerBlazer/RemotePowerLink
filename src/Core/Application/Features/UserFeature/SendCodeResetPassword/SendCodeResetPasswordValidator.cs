using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.UserFeature.SendCodeResetPassword;

[UsedImplicitly]
public class SendCodeResetPasswordValidator: AbstractValidator<SendCodeResetPasswordCommand>
{
    public SendCodeResetPasswordValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}