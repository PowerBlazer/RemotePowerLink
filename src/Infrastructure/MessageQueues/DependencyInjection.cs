using Application.Layers.MessageQueues.UserRegistered;
using Application.Layers.MessageQueues.VerificationEmailSend;
using MassTransit;
using MessageQueues.UserRegistered;
using MessageQueues.VerificationEmailSend;
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
            x.AddConsumer<VerificationEmailSendConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(new Uri($"rabbitmq://{rabbitMqConfiguration?.Host}:{rabbitMqConfiguration?.Port}/"), h =>
                {
                    h.Username(rabbitMqConfiguration?.UserName);
                    h.Password(rabbitMqConfiguration?.Password);
                });

                cfg.ReceiveEndpoint("user-registered-queue", e =>
                {
                    e.ConfigureConsumer<UserRegisteredConsumer>(context);
                });
                
                cfg.ReceiveEndpoint("verification-email-send-queue", e =>
                {
                    e.ConfigureConsumer<VerificationEmailSendConsumer>(context);
                });

            });
        });

        services.AddScoped<IUserRegisteredProducer, UserRegisteredProducer>();
        services.AddScoped<IVerificationEmailSendProducer, VerificationEmailSendProducer>();

        return services;
    }
}

