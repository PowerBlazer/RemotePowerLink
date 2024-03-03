using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class SystemType: BaseEntity<long>
{
    public required string Name { get; set; }
    public string? IconPath { get; set; }

    #region RelationShips
    public IList<Server>? Servers { get; set; }
    
    #endregion
    
}