using Application.Layers.Redis;
using StackExchange.Redis;

namespace Redis.Services;

public sealed class RedisService: IRedisService,IDisposable
{
    private readonly Lazy<ConnectionMultiplexer> _redisConnection;
    private readonly IDatabase _dataBaseRedis;
    public RedisService(RedisConfiguration redisConfiguration)
    {
        _redisConnection =new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.
            Connect($"{redisConfiguration.Host}:" +
                    $"{redisConfiguration.Port}," +
                    $"password={redisConfiguration.Password}")); 
        
        _dataBaseRedis = _redisConnection.Value.GetDatabase();
    }

    public async Task<string?> GetValueAsync(string key)
    {
        return await _dataBaseRedis.StringGetAsync(key);
    }

    public Task<bool> SetValueAsync(string key, string value, TimeSpan? expiry = null)
    {
        return _dataBaseRedis.StringSetAsync(key, value,expiry);
    }

    public Task<bool> DeleteValueAsync(string key)
    {
        return _dataBaseRedis.KeyDeleteAsync(key);
    }

    public async Task<bool> UpdateValueAsync(string key, string value, TimeSpan? expiry = null)
    {
        if (await _dataBaseRedis.KeyExistsAsync(key))
        {
            return await _dataBaseRedis.StringSetAsync(key, value, expiry);
        }

        return false;
    }

    public void Dispose()
    {
        if (_redisConnection.IsValueCreated)
        {
            _redisConnection.Value.Dispose();
        }
    }
}