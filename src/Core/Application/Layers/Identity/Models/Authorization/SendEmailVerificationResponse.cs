namespace Application.Layers.Identity.Models.Authorization;

public class SendEmailVerificationResponse
{
    public required string SessionId { get; set; }
}