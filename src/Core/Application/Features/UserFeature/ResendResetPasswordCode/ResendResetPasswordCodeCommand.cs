using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.UserFeature.ResendResetPasswordCode;

/// <summary>
/// Кодманда для повторного отправления кода, для сброса пароля пользователя
/// </summary>
public class ResendResetPasswordCodeCommand: IRequest<string>
{
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
    
    /// <summary>
    /// Идентификатор сессии
    /// </summary>
    public required string SessionId { get; set; }
}