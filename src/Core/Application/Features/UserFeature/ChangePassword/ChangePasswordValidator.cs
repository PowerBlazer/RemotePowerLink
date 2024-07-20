using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.UserFeature.ChangePassword;

[UsedImplicitly]
public class ChangePasswordValidator: AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.NewPassword)
            .NotNull().WithMessage("Поле не может быть пустым")
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .MinimumLength(5).WithMessage("Длина пароля должно быть больше 5 символов");


        RuleFor(p=> p.PreviousPassword)
            .NotEmpty().WithMessage("Поле не может быть пустым"); 
    }
}