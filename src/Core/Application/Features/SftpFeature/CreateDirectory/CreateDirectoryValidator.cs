using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.SftpFeature.CreateDirectory;

[UsedImplicitly]
public class CreateDirectoryValidator: AbstractValidator<CreateDirectoryCommand>
{
    public CreateDirectoryValidator()
    {
        RuleFor(p => p.DirectoryName)
            .MaximumLength(600).WithMessage("Длина название директории не может превышать 600 символов")
            .When(p => !string.IsNullOrEmpty(p.DirectoryName));
        
        RuleFor(p => p.DirectoryPath)
            .NotEmpty().WithMessage("Поле 'DirectoryPath' не может быть пустым.");
    }
}