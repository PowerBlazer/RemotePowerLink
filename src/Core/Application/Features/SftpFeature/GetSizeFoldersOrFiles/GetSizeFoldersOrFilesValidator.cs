using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.SftpFeature.GetSizeFoldersOrFiles;

[UsedImplicitly]
public class GetSizeFoldersOrFilesValidator: AbstractValidator<GetSizeFoldersOrFilesCommand>
{
    public GetSizeFoldersOrFilesValidator()
    {
        RuleFor(command => command.ServerId)
            .NotEmpty().WithMessage("Идентификатор сервера должен быть указан.");

        RuleFor(command => command.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя должен быть указан.");
    }
}