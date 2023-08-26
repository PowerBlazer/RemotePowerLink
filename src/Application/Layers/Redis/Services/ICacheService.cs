namespace Application.Layers.Redis.Services;

public interface ICacheService
{
    /// <summary>
    /// Get Data using key
    /// </summary>
    /// <param name="key"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    Task<T?> GetValue<T>(string key);
    /// <summary>
    /// Set Data with Value and Expiration Time of Key
    /// </summary>
    /// <param name="key"></param>
    /// <param name="value"></param>
    /// <param name="expiry"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    Task<bool> SetData<T>(string key, T value, TimeSpan expiry);
    /// <summary>
    /// Delete a value by key
    /// </summary>
    /// <param name="key"></param>
    /// <returns>Success Delete(bool)</returns>
    Task<bool> DeleteData(string key);
}