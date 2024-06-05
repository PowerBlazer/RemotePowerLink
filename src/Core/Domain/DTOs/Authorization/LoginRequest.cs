using JetBrains.Annotations;

namespace Domain.DTOs.Authorization;

public class LoginRequest
{
    public LoginRequest(string email, string password, string ipAddress, 
        string? deviceName = null)
    {
        Email = email;
        Password = password;
        IpAddress = ipAddress;
        DeviceName = deviceName;
    }
    
    /// <summary>
    /// Почта пользователя
    /// </summary>
    public string Email { get; }
    /// <summary>
    /// Пароль пользователя
    /// </summary>
    public string Password { get; }
    /// <summary>
    /// Ip адрес пользователя
    /// </summary>
    public string IpAddress { get; }
    public string? DeviceName { get; }
}