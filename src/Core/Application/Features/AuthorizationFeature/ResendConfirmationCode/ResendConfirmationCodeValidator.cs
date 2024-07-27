using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.AuthorizationFeature.ResendConfirmationCode;

[UsedImplicitly]
public class ResendConfirmationCodeValidator: AbstractValidator<ResendConfirmationCodeCommand>
{
    public ResendConfirmationCodeValidator()
    {
        RuleFor(p => p.SessionId)
            .NotNull().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.Email)
            .NotNull().WithMessage("Поле не может быть пустым");
    }
}