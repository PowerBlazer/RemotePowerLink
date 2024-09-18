using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.ResendCodeToChangeEmail;

[UsedImplicitly]
public class ResendCodeToChangeEmailValidator: AbstractValidator<ResendCodeToChangeEmailCommand>
{
    public ResendCodeToChangeEmailValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}