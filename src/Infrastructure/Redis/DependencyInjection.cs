using Application.Layers.Redis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Redis.Services;

namespace Redis;

public static class DependencyInjection
{
    public static IServiceCollection AddRedis(this IServiceCollection services
        ,IConfiguration configuration)
    {
        var redisConfiguration = configuration.GetSection("Redis").Get<RedisConfiguration>();
        
        services.AddScoped<IRedisService>(_ => new RedisService(redisConfiguration!));
        services.AddScoped<ICacheService, CacheService>();
        
        return services;
    }
}