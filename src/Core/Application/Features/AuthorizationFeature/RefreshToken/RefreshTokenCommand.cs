using System.Text.Json.Serialization;
using Application.Layers.Identity.Models.Authorization;
using MediatR;

namespace Application.Features.AuthorizationFeature.RefreshToken;

public class RefreshTokenCommand: IRequest<RefreshTokenResponse>
{
    /// <summary>
    /// Токен доступа
    /// </summary>
    public required string AccessToken { get; set; }
    
    /// <summary>
    /// Токен обновления
    /// </summary>
    [JsonIgnore]
    public string? RefreshToken { get; set; }
    
    [JsonIgnore]
    public string? IpAddress { get; set; }
}