using FluentValidation;

namespace Application.Features.SftpFeature.DownloadFoldersOrFiles;

public class DownloadFoldersOrFilesValidator: AbstractValidator<DownloadFoldersOrFilesCommand>
{
    public DownloadFoldersOrFilesValidator()
    {
        RuleFor(p => p.TempPath)
            .NotEmpty().WithMessage("Не указан путь к директории временных файлов");
        
        RuleFor(command => command.ServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");

        RuleFor(command => command.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя должен быть указан.");
    }
}