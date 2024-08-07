﻿using Application.Layers.Persistence;
using Application.Services;
using Application.Services.Abstract;
using Application.Services.Logic;
using Domain.Repository;
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
        services.AddScoped<IEncodingRepository, EncodingRepository>();
        #endregion

        #region Services
        services.AddScoped<IServerService, ServerService>();
        #endregion
        
       
        
        return services;
    }
}