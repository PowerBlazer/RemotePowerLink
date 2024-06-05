using System.Text.Json.Serialization;

namespace Domain.DTOs.Authorization;

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
    /// Идентификатор пользователя
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}