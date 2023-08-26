using Domain.Entities.Abstractions;

namespace Identity.Entities;

public class IdentityUser:BaseEntity<long>
{
    public string? Email { get; set; }
    public string? PasswordHash { get; set; } 
    public string? PhoneNumber { get; set; }
    public DateTimeOffset DateCreated { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    
    public ICollection<IdentityToken>? IdentityToken { get; set; }
}