using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToUpdatePassword;

/// <summary>
/// Команда для отправления кода, для сброса пароля пользователя
/// </summary>
public class SendCodeUpdatePasswordCommand: IRequest<string>
{
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}