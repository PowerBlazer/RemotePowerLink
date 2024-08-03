using JetBrains.Annotations;

namespace Application.Layers.Identity.Models.Authorization;

[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class RegistrationResponse
{
    public RegistrationResponse(string accessToken, string refreshToken)
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