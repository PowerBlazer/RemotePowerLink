using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class ServerType: BaseEntity<long>
{
    public required string Name { get; set; }
    public string? Photo { get; set; }

    #region RelationShips
    public IList<Server>? Servers { get; set; }
    
    #endregion
    
}