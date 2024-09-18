using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.AuthorizationFeature.ResendCodeToConfirmation;

[UsedImplicitly]
public class ResendCodeToConfirmationValidator: AbstractValidator<ResendCodeToConfirmationCommand>
{
    public ResendCodeToConfirmationValidator()
    {
        RuleFor(p => p.SessionId)
            .NotNull().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.Email)
            .NotNull().WithMessage("Поле не может быть пустым");
    }
}