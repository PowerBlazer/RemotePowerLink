using JetBrains.Annotations;

namespace Domain.DTOs.Authorization;

[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class RefreshTokenResponse
{
    public RefreshTokenResponse(string accessToken, 
        string refreshToken)
    {
        AccessToken = accessToken;
        RefreshToken = refreshToken;
    }
    
    /// <summary>
    /// Токен доступа
    /// </summary>
    public string AccessToken { get; }
    /// <summary>
    /// Токен обновления
    /// </summary>
    public string RefreshToken { get; }
}