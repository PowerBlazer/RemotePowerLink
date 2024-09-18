using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.ResendCodeToConfirmNewEmail;

[UsedImplicitly]
public class ResendCodeToConfirmNewValidator: AbstractValidator<ResendCodeToConfirmNewEmailCommand>
{
    public ResendCodeToConfirmNewValidator()
    {
        RuleFor(p => p.SessionId)
            .NotNull().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.NewEmail)
            .NotNull().WithMessage("Поле не может быть пустым");
    }
}