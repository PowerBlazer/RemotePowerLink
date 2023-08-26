namespace Application.Layers.Redis.Services;

public interface IRedisService
{
    Task<string?> GetValueAsync(string key);
    Task<bool> SetValueAsync(string key, string value, TimeSpan? expiry = null);
    Task<bool> DeleteValueAsync(string key);
    Task<bool> UpdateValueAsync(string key, string value, TimeSpan? expiry = null);
}