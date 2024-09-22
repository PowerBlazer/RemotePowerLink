using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.UserFeature.UpdateEmail;

[UsedImplicitly]
public class UpdateEmailValidator: AbstractValidator<UpdateEmailCommand>
{
    public UpdateEmailValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.SessionId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}