using Domain.Services;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.ProxyFeature.CreateProxy;

[UsedImplicitly]
public class CreateProxyValidator: AbstractValidator<CreateProxyCommand>
{
    public CreateProxyValidator(IServerService serverService)
    {
        RuleFor(p => p.Hostname)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .Must(serverService.ValidateServerAddress).WithMessage("Недопустимый формат адреса сервера");
        
        RuleFor(p => p.Title)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .MaximumLength(255).WithMessage("Поле не может превышать 255 символов");
        
        RuleFor(p => p.SshPort)
            .Must(port => port is null or > 0 and <= 65535)
            .WithMessage("Недопустимое значение порта.");

        RuleFor(p => p.IdentityId)
            .NotEmpty().WithMessage("Поле 'IdentityId' не может быть пустым.");
    }
}