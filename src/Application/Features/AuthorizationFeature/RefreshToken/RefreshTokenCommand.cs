using System.Text.Json.Serialization;
using Domain.DTOs.Authorization;
using MediatR;

namespace Application.Features.AuthorizationFeature.RefreshToken;

public class RefreshTokenCommand: IRequest<RefreshTokenResponse>
{
    public RefreshTokenCommand(string accessToken, string refreshToken)
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
    [JsonIgnore]
    public string? IpAddress { get; set; }
}