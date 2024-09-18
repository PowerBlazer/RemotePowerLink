using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.VerifyCodeToChangeEmail;

[UsedImplicitly]
public class VerifyCodeToChangeEmailValidator: AbstractValidator<VerifyCodeToChangeEmailCommand>
{
    public VerifyCodeToChangeEmailValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}