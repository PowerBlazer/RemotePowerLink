using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.UserFeature.ChangePassword;

/// <summary>
/// Командна для изменения пароля у пользователя
/// </summary>
public class ChangePasswordCommand: IRequest
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