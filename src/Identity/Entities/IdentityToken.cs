using Domain.Entities.Abstractions;

namespace Identity.Entities;

public class IdentityToken: BaseEntity<long>
{
    public long UserId { get; set; }
    public string? Token { get; set; }
    public DateTime Expiration { get; set; }
    public required string IpAddress { get; set; }
    public string? DeviceName { get; set; }
    public IdentityUser? User { get; set; }
}