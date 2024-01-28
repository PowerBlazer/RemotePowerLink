using Domain.Entities.Abstractions;
// ReSharper disable CollectionNeverUpdated.Global

namespace Identity.Entities;

public class IdentityUser:BaseEntity<long>
{
    public string? Email { get; set; }
    public string? PasswordHash { get; set; } 
    public string? PhoneNumber { get; set; }
    public DateTimeOffset DateCreated { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    
    public IList<IdentityToken>? IdentityToken { get; set; }
}