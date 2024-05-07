namespace Application.Layers.Identity.Models;

public class UserInformation
{
    public required long UserId { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTimeOffset DateCreated { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
}