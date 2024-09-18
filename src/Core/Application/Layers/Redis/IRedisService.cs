namespace Application.Layers.Redis;

public interface IRedisService
{
    Task<string?> GetValue(string key);
    Task<bool> SetValue(string key, string value, TimeSpan? expiry = null);
    Task<bool> DeleteValue(string key);
    Task<bool> UpdateValue(string key, string value, TimeSpan? expiry = null);
}