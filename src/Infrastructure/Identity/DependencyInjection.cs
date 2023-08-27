using Application.Layers.Identity;
using Application.Layers.Identity.Services;
using Identity.Contexts;
using Identity.Interfaces;
using Identity.Repositories;
using Identity.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentity(this IServiceCollection services
        ,IConfiguration configuration)
    {
        #region DataBase
        var connectionString = configuration["DB_IDENTITY_CONNECTION_STRING"] is null
            ? configuration.GetConnectionString("LocalDbIdentity")
            : configuration["DB_IDENTITY_CONNECTION_STRING"]!;

        services.AddDbContext<IdentityContext>(options =>
        {
            options.UseNpgsql(
                connectionString,
                provider => provider.EnableRetryOnFailure()
            );
            
            options.UseSnakeCaseNamingConvention();
        });
        #endregion
        
        services.AddSingleton<JwtOptions>(_ => configuration.GetSection("JWT")
            .Get<JwtOptions>()!);
        
        #region Repositories
        services.AddScoped<IIdentityTokenRepository, IdentityTokenRepository>();
        services.AddScoped<IIdentityUserRepository, IdentityUserRepository>();
        services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();
        #endregion
        
        #region Services
        services.AddScoped<IAuthorizationService, AuthorizationService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ITokenService, TokenService>();
        #endregion
        
        return services;
    }
}