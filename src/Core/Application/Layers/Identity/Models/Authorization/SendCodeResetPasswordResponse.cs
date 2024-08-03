namespace Application.Layers.Identity.Models.Authorization;

public class SendCodeResetPasswordResponse
{
    /// <summary>
    /// Идентификатор сессии
    /// </summary>
    public required string SessionId { get; set; }
}