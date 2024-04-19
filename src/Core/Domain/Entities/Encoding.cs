using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class Encoding: BaseEntity<long>
{
    /// <summary>
    /// Название кодировки.
    /// </summary>
    public required string Name { get; set; }
    
    /// <summary>
    /// Кодовая страница кодировки
    /// </summary>
    public required int CodePage { get; set; }

    #region Relationships
    /// <summary>
    /// Список серверов, связанных с этой кодировкой.
    /// </summary>
    public List<Server>? Servers { get; set; }
    #endregion
   
}