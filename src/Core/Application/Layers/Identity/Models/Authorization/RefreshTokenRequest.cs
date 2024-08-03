namespace Application.Layers.Identity.Models.Authorization;

public class RefreshTokenRequest
{
    public RefreshTokenRequest(string accessToken, string refreshToken,string ipAddress)
    {
        AccessToken = accessToken;
        RefreshToken = refreshToken;
        IpAddress = ipAddress;
    }
    /// <summary>
    /// Токен доступа
    /// </summary>
    public string AccessToken { get; }
    /// <summary>
    /// Токен обновления
    /// </summary>
    public string RefreshToken { get; }
    /// <summary>
    /// Ip адрес пользователя
    /// </summary>
    public string IpAddress { get; }
}