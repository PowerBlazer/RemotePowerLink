using FluentValidation;

namespace Application.Features.UserFeature.ResendResetPasswordCode;

public class ResendResetPasswordCodeValidator: AbstractValidator<ResendResetPasswordCodeCommand>
{
    public ResendResetPasswordCodeValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}