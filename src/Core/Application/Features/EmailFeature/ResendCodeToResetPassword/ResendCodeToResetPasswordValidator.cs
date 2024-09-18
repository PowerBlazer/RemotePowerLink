using FluentValidation;

namespace Application.Features.EmailFeature.ResendCodeToResetPassword;

public class ResendCodeToResetPasswordValidator: AbstractValidator<ResendCodeToResetPasswordCommand>
{
    public ResendCodeToResetPasswordValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}