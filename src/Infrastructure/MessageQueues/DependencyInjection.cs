using Application.Layers.MessageQueues.SendCodeToChangeEmail;
using Application.Layers.MessageQueues.SendCodeToConfirmEmail;
using Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;
using Application.Layers.MessageQueues.SendCodeToUpdatePassword;
using Application.Layers.MessageQueues.UserRegistered;
using MassTransit;
using MessageQueues.SendCodeToChangeEmail;
using MessageQueues.SendCodeToConfirmEmail;
using MessageQueues.SendCodeToConfirmNewEmail;
using MessageQueues.SendCodeToUpdatePassword;
using MessageQueues.UserRegistered;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MessageQueues;

public static class DependencyInjection
{
    public static IServiceCollection AddMessageQueue(this IServiceCollection services,
        IConfiguration configuration)
    {
        var rabbitMqConfiguration = configuration
            .GetSection("RabbitMq")
            .Get<RabbitConfiguration>();
        
        services.AddMassTransit(x =>
        {
            x.AddConsumer<UserRegisteredConsumer>();
            x.AddConsumer<SendCodeToConfirmEmailConsumer>();
            x.AddConsumer<SendCodeToUpdatePasswordConsumer>();
            x.AddConsumer<SendCodeToChangeEmailConsumer>();
            x.AddConsumer<SendCodeToConfirmNewEmailConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(new Uri($"rabbitmq://{rabbitMqConfiguration?.Host}:{rabbitMqConfiguration?.Port}/"), h =>
                {
                    h.Username(rabbitMqConfiguration?.UserName);
                    h.Password(rabbitMqConfiguration?.Password);
                });

                cfg.ReceiveEndpoint("user-registered-queue", e => 
                    e.ConfigureConsumer<UserRegisteredConsumer>(context));

                cfg.ReceiveEndpoint("send-code-to-confirm-email-queue", e =>
                    e.ConfigureConsumer<SendCodeToConfirmEmailConsumer>(context));
                
                cfg.ReceiveEndpoint("send-code-to-update-password-queue", e => 
                    e.ConfigureConsumer<SendCodeToUpdatePasswordConsumer>(context));
                
                cfg.ReceiveEndpoint("send-code-to-change-email-queue", e => 
                    e.ConfigureConsumer<SendCodeToChangeEmailConsumer>(context));
                
                cfg.ReceiveEndpoint("send-code-to-change-new-email-queue", e=> 
                    e.ConfigureConsumer<SendCodeToConfirmNewEmailConsumer>(context));

            });
        });

        services.AddScoped<IUserRegisteredProducer, UserRegisteredProducer>();
        services.AddScoped<ISendCodeToConfirmEmailProducer, SendCodeToConfirmEmailProducer>();
        services.AddScoped<ISendCodeToUpdatePasswordProducer, SendCodeToUpdatePasswordProducer>();
        services.AddScoped<ISendCodeToChangeEmailProducer, SendCodeToChangeEmailProducer>();
        services.AddScoped<ISendCodeToConfirmNewEmailProducer, SendCodeToConfirmNewEmailProducer>();

        return services;
    }
}

