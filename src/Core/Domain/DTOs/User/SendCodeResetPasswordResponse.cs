namespace Domain.DTOs.User;

public class SendCodeResetPasswordResponse
{
    /// <summary>
    /// Идентификатор сессии
    /// </summary>
    public required string SessionId { get; set; }
}