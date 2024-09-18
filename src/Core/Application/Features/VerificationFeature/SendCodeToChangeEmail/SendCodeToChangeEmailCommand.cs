using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToChangeEmail;

/// <summary>
/// Команда для отправления кода для изменения почты
/// </summary>
public class SendCodeToChangeEmailCommand: IRequest<string>
{
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}