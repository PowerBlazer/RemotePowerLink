using Application.Services;
using Domain.Layers.Persistence.Contexts;
using Domain.Repository;
using Domain.Services;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Context;
using Persistence.Repository;

namespace Persistence;

public static class DependencyInjection
{
    [UsedImplicitly]
    public static IServiceCollection AddPersistence(this IServiceCollection services
        , IConfiguration configuration)
    {
        var connectionString = configuration["DB_APPLICATION_CONNECTION_STRING"] is null
            ? configuration.GetConnectionString("LocalDbApplication")
            : configuration["DB_APPLICATION_CONNECTION_STRING"]!;
        
        services.AddDbContext<IPersistenceContext,PersistenceContext>(options =>
        {
            options.UseNpgsql(
                connectionString,
                provider => provider.EnableRetryOnFailure()
            );
            
            options.UseSnakeCaseNamingConvention();
        });

        #region Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IIdentityRepository, IdentityRepository>();
        services.AddScoped<IProxyRepository, ProxyRepository>();
        services.AddScoped<IServerRepository, ServerRepositrory>();
        services.AddScoped<ISystemTypeRepository, SystemTypeRepository>();
        #endregion

        #region Services
        services.AddScoped<IHostService, HostService>();
        #endregion
        
       
        
        return services;
    }
}