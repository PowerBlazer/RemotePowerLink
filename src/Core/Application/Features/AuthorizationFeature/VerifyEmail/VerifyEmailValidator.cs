using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.AuthorizationFeature.VerifyEmail;

[UsedImplicitly]
public class VerifyEmailValidator: AbstractValidator<VerifyEmailCommand>
{
    public VerifyEmailValidator()
    {
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.VerificationCode)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}