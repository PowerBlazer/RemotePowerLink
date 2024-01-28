using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class Proxy: BaseEntity<long>
{
    public required string Title { get; set; }
    public required string Ip { get; set; }
    public required int Port { get; set; }

    #region Relationships
    //Identity
    public required long IdentityId { get; set; }
    public required Identity Identity { get; set; }
    
    //User
    public required long UserId { get; set; }
    public required User User { get; set; }
    
    //Servers
    public IList<Server>? Servers { get; set; }

    #endregion
   
}