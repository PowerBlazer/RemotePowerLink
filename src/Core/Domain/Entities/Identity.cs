using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class Identity: BaseEntity<long>
{
    public required string Title { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }

    #region Relationships

    public required long UserId { get; set; }
    public required User User { get; set; }

    public IList<Proxy>? Proxies { get; set; }
    public IList<Server>? Servers { get; set; }

    #endregion
}