using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.SftpFeature.UploadFiles;

[UsedImplicitly]
public class UploadFilesValidator: AbstractValidator<UploadFilesCommand>
{
    public UploadFilesValidator()
    {
        RuleFor(p => p.UploadPath)
            .NotEmpty().WithMessage("Не указан путь к директории для загрузки файлов");
        
        RuleFor(command => command.ServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");

        RuleFor(command => command.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя должен быть указан.");
    }
}