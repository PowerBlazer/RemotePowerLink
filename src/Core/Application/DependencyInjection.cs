using System.Reflection;
using Application.Builders;
using Application.Builders.Abstract;
using Application.Features.AuthorizationFeature;
using Application.Hubs;
using Application.Middlewares;
using Application.Services.Abstract;
using Application.Services.Logic;
using FluentValidation;
using JetBrains.Annotations;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

#pragma warning disable CS0618

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services
        , [UsedImplicitly] IConfiguration configuration)
    {
        services.AddMediatR(ctg => ctg.RegisterServicesFromAssemblies(Assembly.GetExecutingAssembly()));

        AssemblyScanner.FindValidatorsInAssembly(Assembly.GetExecutingAssembly())
            .ForEach(item => services.AddScoped(item.InterfaceType, item.ValidatorType));
        ValidatorOptions.Global.DefaultRuleLevelCascadeMode = CascadeMode.StopOnFirstFailure;
        
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidatorBehavior<,>));
        services.AddAutoMapper(typeof(AuthorizationProfile));

        #region Services
        services.AddScoped<ISftpManagerService, SftpManagerService>();
        
        services.AddSingleton<ISftpConnectionService, SftpConnectionService>();
        services.AddSingleton<SftpDisconnectService>();
        services.AddSingleton<IEncryptionService, EncryptionService>();
        services.AddSingleton<IConnectionService, ConnectionService>();
        
        services.AddSingleton<ISessionConnectionService,SessionConnectionService>(p =>
        {
            var rootPath = configuration.GetValue<string>(WebHostDefaults.ContentRootKey);
            var serviceScopeFactory = p.GetRequiredService<IServiceScopeFactory>();
            var hubContext = p.GetRequiredService<IHubContext<TerminalHub>>();
            
            return new SessionConnectionService(serviceScopeFactory, rootPath, hubContext);
        });

        services.AddSingleton<SessionDisconnectService>();
        #endregion
        
        #region Builders

        services.AddScoped<ISessionInstanceBuilder, SshSessionInstanceBuilder>();
        #endregion
        
        return services;
    }
}