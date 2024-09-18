using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.VerifyCodeToConfirmNewEmail;

[UsedImplicitly]
public class VerifyCodeToConfirmNewEmailValidator: AbstractValidator<VerifyCodeToConfirmNewEmailCommand>
{
    public VerifyCodeToConfirmNewEmailValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}