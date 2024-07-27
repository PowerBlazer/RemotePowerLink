using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.UserFeature.VerifyResetPasswordCode;

[UsedImplicitly]
public class VerifyResetPasswordCodeValidator: AbstractValidator<VerifyResetPasswordCodeCommand>
{
    public VerifyResetPasswordCodeValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}