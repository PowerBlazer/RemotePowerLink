
using Application.Layers.Redis.Services;
using StackExchange.Redis;

namespace Redis.Services;

public class RedisService: IRedisService,IDisposable
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

    public async Task<bool> SetValueAsync(string key, string value, TimeSpan? expiry = null)
    {
        return await _dataBaseRedis.StringSetAsync(key, value,expiry);
    }

    public async Task<bool> DeleteValueAsync(string key)
    {
        return await _dataBaseRedis.KeyDeleteAsync(key);
    }

    public async Task<bool> UpdateValueAsync(string key, string value, TimeSpan? expiry = null)
    {
        if (await _dataBaseRedis.KeyExistsAsync(key))
        {
            return await _dataBaseRedis.StringSetAsync(key, value, expiry);
        }

        return false;
    }

    public virtual void Dispose()
    {
        if (_redisConnection.IsValueCreated)
        {
            _redisConnection.Value.Dispose();
        }
    }
}