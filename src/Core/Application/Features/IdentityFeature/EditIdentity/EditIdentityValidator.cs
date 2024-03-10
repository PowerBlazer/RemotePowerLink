using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.IdentityFeature.EditIdentity;

[UsedImplicitly]
public class EditIdentityValidator: AbstractValidator<EditIdentityCommand>
{
    public EditIdentityValidator()
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