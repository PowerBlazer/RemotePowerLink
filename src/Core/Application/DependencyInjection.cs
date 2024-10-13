using System.Reflection;
using Application.Features.AuthorizationFeature;
using Application.Middlewares;
using Application.Services.Abstract;
using Application.Services.Logic;
using FluentValidation;
using JetBrains.Annotations;
using MediatR;
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
        services.AddSingleton<ISftpConnectionService, SftpConnectionService>();
        services.AddScoped<ISftpManagerService, SftpManagerService>();
        services.AddSingleton<SftpDisconnectService>();
        #endregion
        
        return services;
    }
}