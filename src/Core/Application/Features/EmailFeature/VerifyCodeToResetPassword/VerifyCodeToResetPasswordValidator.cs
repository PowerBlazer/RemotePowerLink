using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.EmailFeature.VerifyCodeToResetPassword;

[UsedImplicitly]
public class VerifyCodeToResetPasswordValidator: AbstractValidator<VerifyCodeToResetPasswordCommand>
{
    public VerifyCodeToResetPasswordValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}