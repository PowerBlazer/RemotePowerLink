using MediatR;
using Newtonsoft.Json;

namespace Application.Features.UserFeature.UpdateEmail;

/// <summary>
/// Команда для обновления почтового ящика пользователя
/// </summary>
public class UpdateEmailCommand: IRequest
{
    /// <summary>
    /// Идентификатор сессии сброса пароля
    /// </summary>
    public required string SessionId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}