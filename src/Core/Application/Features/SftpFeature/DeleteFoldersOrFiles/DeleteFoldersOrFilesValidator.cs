using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.SftpFeature.DeleteFoldersOrFiles;

[UsedImplicitly]
public class DeleteFoldersOrFilesValidator : AbstractValidator<DeleteFoldersOrFilesCommand>
{
    public DeleteFoldersOrFilesValidator()
    {
        RuleFor(command => command.FilesOrFoldersToDeleteList)
            .NotEmpty().WithMessage("Список файлов или папок для удаления не может быть пустым.")
            .Must(list => list.All(_ => true)).WithMessage("Список файлов или папок содержит нулевые элементы.");
        
        RuleFor(command => command.ServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");

        RuleFor(command => command.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя должен быть указан.");
    }
}