using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToChangeEmail;

/// <summary>
/// Кодманда для повторного отправления кода, для изменения почтового ящика пользователя
/// </summary>
public class ResendCodeToChangeEmailCommand: IRequest<string>
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