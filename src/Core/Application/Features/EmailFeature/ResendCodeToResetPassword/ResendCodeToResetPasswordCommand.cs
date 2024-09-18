using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.EmailFeature.ResendCodeToResetPassword;

/// <summary>
/// Кодманда для повторного отправления кода, для сброса пароля пользователя
/// </summary>
public class ResendCodeToResetPasswordCommand: IRequest<string>
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