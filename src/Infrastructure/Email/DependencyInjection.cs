using Application.Layers.Email.Services;
using Email.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Email;


public static class DependencyInjection
{
    public static IServiceCollection AddEmail(this IServiceCollection services
        , IConfiguration configuration)
    {
        var emailConfiguration = configuration.GetSection("Email").Get<EmailConfiguration>();

        services.AddSingleton<ISmtpEmailService>(_ => 
            new SmtpEmailService(emailConfiguration!));
        
        return services;
    }
}