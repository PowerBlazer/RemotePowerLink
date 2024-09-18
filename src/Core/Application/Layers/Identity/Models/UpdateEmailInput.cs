using System.Text.Json.Serialization;

namespace Application.Layers.Identity.Models;

public class UpdateEmailInput
{
    /// <summary>
    /// Новый Email пользователя
    /// </summary>
    public required string NewEmail { get; set; }
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