using FluentValidation;

namespace Application.Features.SftpFeature.SendFoldersOrFiles;

public class SendFoldersOrFilesValidator: AbstractValidator<SendFoldersOrFilesCommand>
{
    public SendFoldersOrFilesValidator()
    {
        RuleFor(p => p.RemotePath)
            .NotEmpty().WithMessage("Не указан путь к директории");
        
        RuleFor(command => command.SourceServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");
        
        RuleFor(command => command.TargetServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");

        RuleFor(command => command.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя должен быть указан.");
    }
}