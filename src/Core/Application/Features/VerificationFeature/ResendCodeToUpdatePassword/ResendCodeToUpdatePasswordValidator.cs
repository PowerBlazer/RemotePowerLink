using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.ResendCodeToUpdatePassword;

[UsedImplicitly]
public class ResendCodeToUpdatePasswordValidator: AbstractValidator<ResendCodeToUpdatePasswordCommand>
{
    public ResendCodeToUpdatePasswordValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p => p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}