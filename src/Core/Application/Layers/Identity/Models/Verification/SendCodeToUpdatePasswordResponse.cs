namespace Application.Layers.Identity.Models.Verification;

public class SendCodeToUpdatePasswordResponse
{
    /// <summary>
    /// Идентификатор сессии
    /// </summary>
    public required string SessionId { get; set; }
}