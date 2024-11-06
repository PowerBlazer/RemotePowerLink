namespace Domain.DTOs.Authorization;

public class RegistrationResponse
{
    public RegistrationResponse(string accessToken)
    {
        AccessToken = accessToken;
    }

    /// <summary>
    /// Токен доступа
    /// </summary>
    public string AccessToken { get; }
}