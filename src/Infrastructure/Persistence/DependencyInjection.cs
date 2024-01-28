using Application.Layers.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Context;

namespace Persistence;

public static class DependencyInjection
{
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
        
        return services;
    }
}