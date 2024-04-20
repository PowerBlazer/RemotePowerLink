using FluentValidation;

namespace Application.Features.SftpFeature.RenameFolderOrFile;

public class RenameFolderOrFileValidator: AbstractValidator<RenameFolderOrFileCommand>
{
    public RenameFolderOrFileValidator()
    {
        RuleFor(p => p.FileItemNewName)
            .MaximumLength(600).WithMessage("Длина название директории не может превышать 600 символов")
            .When(p => !string.IsNullOrEmpty(p.FileItemNewName));
        
        RuleFor(p => p.FileItemPath)
            .NotEmpty().WithMessage("Поле 'DirectoryPath' не может быть пустым.");
    }
}