using Domain.Layers.Persistence.Services;
using FluentValidation;

namespace Application.Features.ServerFeature.EditServer;

public class EditServerValidator: AbstractValidator<EditServerCommand>
{
    public EditServerValidator(IHostService hostService)
    {
        
        RuleFor(p => p.Hostname)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .Must(hostService.ValidateServerAddress).WithMessage("Недопустимый формат адреса сервера");

        RuleFor(p => p.Title)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .MaximumLength(255).WithMessage("Поле не может превышать 255 символов");
        
        RuleFor(p => p.SshPort)
            .Must(port => port is null or > 0 and <= 65535)
            .WithMessage("Недопустимое значение порта.");
        
        RuleFor(p => p.StartupCommand)
            .MaximumLength(600).WithMessage("Длина команды запуска не может превышать 600 символов")
            .When(p => !string.IsNullOrEmpty(p.StartupCommand));


        RuleFor(p => p.IdentityId)
            .NotEmpty().WithMessage("Поле 'IdentityId' не может быть пустым.");
    }
}