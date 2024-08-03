
using JetBrains.Annotations;

namespace Application.Layers.Identity.Models.Authorization;

[UsedImplicitly]
public class RegistrationRequest
{
    public RegistrationRequest(string sessionId, 
        string userName, 
        string password,
        string ipAddress,
        string? deviceName = null)
    {
        SessionId = sessionId;
        UserName = userName;
        Password = password;
        IpAddress = ipAddress;
        DeviceName = deviceName;
    }
    
    /// <summary>
    /// ID сессии
    /// </summary>
    public string SessionId { get; }
    /// <summary>
    /// Имя пользователя
    /// </summary>
    public string UserName { get; } 
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