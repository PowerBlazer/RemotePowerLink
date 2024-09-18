using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.ResendCodeToConfirmEmail;

[UsedImplicitly]
public class ResendCodeToConfirmEmailValidator: AbstractValidator<ResendCodeToConfirmEmailCommand>
{
    public ResendCodeToConfirmEmailValidator()
    {
        RuleFor(p => p.SessionId)
            .NotNull().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.Email)
            .NotNull().WithMessage("Поле не может быть пустым");
    }
}