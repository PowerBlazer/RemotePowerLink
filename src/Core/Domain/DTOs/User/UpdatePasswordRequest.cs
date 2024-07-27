using System.Text.Json.Serialization;

namespace Domain.DTOs.User;

public class UpdatePasswordRequest
{
    /// <summary>
    /// Предыдущий пароль полльзователя
    /// </summary>
    public required string PreviousPassword { get; set; }
    
    /// <summary>
    /// Новый пароль пользователя
    /// </summary>
    public required string NewPassword { get; set; }
    
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