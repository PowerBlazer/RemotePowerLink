using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.EmailFeature.SendCodeToResetPassword;

/// <summary>
/// Команда для отправления кода, для сброса пароля пользователя
/// </summary>
public class SendCodeResetPasswordCommand: IRequest<string>
{
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}