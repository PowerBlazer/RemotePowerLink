namespace Domain.DTOs.Authorization;

public class LoginResponse
{
    public LoginResponse(string accessToken)
    {
        AccessToken = accessToken;
    }

    /// <summary>
    /// Токен доступа
    /// </summary>
    public string AccessToken { get; }
}