using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.VerifyCodeToUpdatePassword;

[UsedImplicitly]
public class VerifyCodeToUpdatePasswordValidator: AbstractValidator<VerifyCodeToUpdatePasswordCommand>
{
    public VerifyCodeToUpdatePasswordValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}