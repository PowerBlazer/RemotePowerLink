using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.IdentityFeature.CreateIdentity;

[UsedImplicitly]
public class CreateIdentityValidator: AbstractValidator<CreateIdentityCommand>
{
    public CreateIdentityValidator()
    {
        RuleFor(p=> p.Title)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .MaximumLength(255).WithMessage("Поле не может превышать 255 символов");

        RuleFor(p => p.Username)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.Password)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}