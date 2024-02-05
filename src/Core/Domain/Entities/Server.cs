using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class Server: BaseEntity<long>
{
    public required string Title { get; set; }
    public required string Ip { get; set; }
    public int? Port { get; set; }
    public string? StartupCommand { get; set; }
    
    #region Relationships
    //Identity
    public required long IdentityId { get; set; }
    public required Identity Identity { get; set; }
    
    //User
    public required long UserId { get; set; }
    public required User User { get; set; }
    
    //Proxy
    public long? ProxyId { get; set; }
    public Proxy? Proxy { get; set; }
    
    //ServerType
    public long? ServerTypeId { get; set; }
    public ServerType? ServerType { get; set; }

    #endregion
}