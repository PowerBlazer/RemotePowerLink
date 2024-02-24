using Application.Layers.Persistence.Services;
using FluentValidation;

namespace Application.Features.ProxyFeature.CreateProxy;

public class CreateProxyValidator: AbstractValidator<CreateProxyCommand>
{
    public CreateProxyValidator(IHostService hostService)
    {
        RuleFor(p => p.Hostname)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .Must(hostService.ValidateServerAddress).WithMessage("Недопустимый формат адреса сервера");
        
        RuleFor(p => p.Title)
            .NotEmpty().WithMessage("Поле не может быть пустым")
            .MaximumLength(255).WithMessage("Поле не может превышать 255 символов");
        
        RuleFor(p => p.Port)
            .Must(port => port == null || (port > 0 && port <= 65535))
            .WithMessage("Недопустимое значение порта.");

        RuleFor(p => p.IdentityId)
            .NotEmpty().WithMessage("Поле 'IdentityId' не может быть пустым.");
    }
}