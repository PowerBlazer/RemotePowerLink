using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.VerifyCodeToConfirmEmail;

[UsedImplicitly]
public class VerifyCodeToConfirmEmailValidator: AbstractValidator<VerifyCodeToConfirmEmailCommand>
{
    public VerifyCodeToConfirmEmailValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}