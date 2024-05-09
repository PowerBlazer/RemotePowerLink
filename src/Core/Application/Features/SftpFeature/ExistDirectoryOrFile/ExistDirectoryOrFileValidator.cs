using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.SftpFeature.ExistDirectoryOrFile;

[UsedImplicitly]
public class ExistDirectoryOrFileValidator: AbstractValidator<ExistDirectoryOrFileCommand>
{
    public ExistDirectoryOrFileValidator()
    {
        RuleFor(command => command.ServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");

        RuleFor(command => command.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя должен быть указан.");

        RuleFor(command => command.FolderOrFilePath)
            .NotEmpty().WithMessage("Путь к директории или к файлу должен быть указан");
    }
}