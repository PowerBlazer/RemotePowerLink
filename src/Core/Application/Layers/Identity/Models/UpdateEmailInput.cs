

namespace Application.Layers.Identity.Models;

public class UpdateEmailInput
{
    /// <summary>
    /// Идентификатор сессии сброса пароля
    /// </summary>
    public required string SessionId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    public required long UserId { get; set; }
}