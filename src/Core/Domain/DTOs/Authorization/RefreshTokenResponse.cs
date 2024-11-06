namespace Domain.DTOs.Authorization;

public class RefreshTokenResponse
{
    public RefreshTokenResponse(string accessToken)
    {
        AccessToken = accessToken;
    }

    /// <summary>
    /// Токен доступа
    /// </summary>
    public string AccessToken { get; }
}