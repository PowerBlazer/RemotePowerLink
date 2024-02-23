using Application.Layers.Persistence.Repositories;
using Application.Layers.Persistence.Services;
using Application.Layers.Persistence.Services.Parameters;
using Application.Layers.Persistence.Services.Parameters.CheckConnectionServer;
using FluentValidation;

namespace Application.Features.ServerFeature.CreateServer;

public class CreateServerValidator: AbstractValidator<CreateServerCommand>
{
    public CreateServerValidator(IHostService hostService, 
        IIdentityRepository identityRepository, 
        IProxyRepository proxyRepository,
        IUserRepository userRepository)
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
        
        RuleFor(p => p.StartupCommand)
            .MaximumLength(600).WithMessage("Длина команды запуска не может превышать 600 символов")
            .When(p => !string.IsNullOrEmpty(p.StartupCommand));


        RuleFor(p => p.IdentityId)
            .NotEmpty().WithMessage("Поле 'IdentityId' не может быть пустым.")
            .MustAsync(async (id, _) => await identityRepository.GetIdentityDefaultAsync(id) is not null)
            .WithMessage("Учетная запись с указанным 'IdentityId' не найдена.");

        RuleFor(p => p.UserId)
            .NotEmpty().WithMessage("Поле 'UserId' не может быть пустым.")
            .MustAsync(async (id, _) => await userRepository.GetUserDefaultAsync(id) is not null)
            .WithMessage("Пользователь с указанным 'UserId' не найдена.");
        
        RuleFor(p => p.ProxyId)
            .MustAsync(async (id, _) =>
            {
                if (id is null)
                    return true;

                return await proxyRepository.GetProxyDefaultAsync(id.Value) is not null;
            })
            .WithMessage("Прокси сервер с указанным 'ProxyId' не найдена.");
        
        RuleFor(p => p)
            .MustAsync(async (serverParameter, cancellationToken) =>
            {
                var identity = await identityRepository.GetIdentityAsync(serverParameter.IdentityId);
                var proxy = await proxyRepository.GetProxyDefaultAsync(serverParameter.ProxyId ?? 0);
                
                var checkConnectionServerParameter = new CheckConnectionServerParameter
                {
                    Hostname = serverParameter.Hostname,
                    SshPort = serverParameter.Port,
                    Username = identity.Username,
                    Password = identity.Password,
                };

                if (proxy is not null)
                {
                    var proxyIdentity = await identityRepository.GetIdentityAsync(proxy.IdentityId);
                    
                    checkConnectionServerParameter.Proxy = new ProxyParameter
                    {
                        Hostname = proxy.Ip,
                        SshPort = proxy.Port,
                        Username = proxyIdentity.Username,
                        Password = proxyIdentity.Password
                    };
                }
                
                return await hostService.CheckConnectionServer(checkConnectionServerParameter, cancellationToken);
            }).WithMessage("Не удалось установить соединение с сервером.");
           
    }
}