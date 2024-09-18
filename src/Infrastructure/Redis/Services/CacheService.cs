using System.Text.Json;
using Application.Layers.Redis;

namespace Redis.Services;

public class CacheService: ICacheService
{
    private readonly IRedisService _redisService;

    public CacheService(IRedisService redisService)
    {
        _redisService = redisService;
    }
    
    public async Task<T?> GetValue<T>(string key)
    {
        var value = await _redisService.GetValue(key);

        return value is not null 
            ? JsonSerializer.Deserialize<T>(value) 
            : default;
    }

    public async Task<bool> SetData<T>(string key, T value, TimeSpan expiry)
    {
        var serializeObject = JsonSerializer.Serialize(value);

        var isSet = await _redisService.SetValue(key, serializeObject, expiry);

        return isSet;
    }

    public Task<bool> DeleteData(string key)
    {
        return _redisService.DeleteValue(key);
    }
}