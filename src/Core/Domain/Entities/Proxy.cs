using Domain.Entities.Abstractions;

namespace Domain.Entities;

/// <summary>
/// Информация о прокси для подключения к серверу через SSH.
/// </summary>
public class Proxy : BaseEntity<long>
{
    /// <summary>
    /// Название прокси.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// IP-адрес прокси.
    /// </summary>
    public required string IpAddress { get; set; }

    /// <summary>
    /// Порт прокси.
    /// </summary>
    public int Port { get; set; }
    
    /// <summary>
    /// Дата и время создания прокси
    /// </summary>
    public DateTime DateCreated { get; set; }

    #region Relationships
    
    /// <summary>
    /// Id идентификатора, связанной с этим прокси.
    /// </summary>
    public required long IdentityId { get; set; }

    /// <summary>
    /// Идентификатор, связанная с этим прокси.
    /// </summary>
    public Identity? Identity { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, связанного с этим прокси.
    /// </summary>
    public required long UserId { get; set; }

    /// <summary>
    /// Пользователь, связанный с этим прокси.
    /// </summary>
    public User? User { get; set; }
    
    /// <summary>
    /// Список серверов, связанных с этим прокси.
    /// </summary>
    public IList<Server>? Servers { get; set; }

    #endregion
}
