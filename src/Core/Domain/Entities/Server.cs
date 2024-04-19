using Domain.Entities.Abstractions;

namespace Domain.Entities;

/// <summary>
/// Представляет информацию о сервере для подключения по SSH.
/// </summary>
public class Server : BaseEntity<long>
{
    /// <summary>
    /// Заголовок сервера.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// IP-адрес сервера.
    /// </summary>
    public required string IpAddress { get; set; }

    /// <summary>
    /// Порт для подключения по SSH.
    /// </summary>
    public int? SshPort { get; set; }

    /// <summary>
    /// Команда запуска для сервера.
    /// </summary>
    public string? StartupCommand { get; set; }
    /// <summary>
    /// Дата и время создания сервера
    /// </summary>
    public DateTime DateCreated { get; set; }

    #region Relationships

    //Identity
    /// <summary>
    /// Id идентификатора сервера.
    /// </summary>
    public required long IdentityId { get; set; }

    /// <summary>
    /// Идентификатор сервера.
    /// </summary>
    public Identity? Identity { get; set; }

    //User
    /// <summary>
    /// Идентификатор пользователя, которому принадлежит сервер.
    /// </summary>
    public required long UserId { get; set; }

    /// <summary>
    /// Пользователь, которому принадлежит сервер.
    /// </summary>
    public User? User { get; set; }

    //Proxy
    /// <summary>
    /// Идентификатор прокси сервера.
    /// </summary>
    public long? ProxyId { get; set; }

    /// <summary>
    /// Прокси сервера.
    /// </summary>
    public Proxy? Proxy { get; set; }
    
    /// <summary>
    /// Идентификатор типа сервера.
    /// </summary>
    public required long SystemTypeId { get; set; }

    /// <summary>
    /// Тип сервера.
    /// </summary>
    public SystemType? SystemType { get; set; }

    /// <summary>
    /// Идентификатор кодировки
    /// </summary>
    public long EncodingId { get; set; }
    
    /// <summary>
    /// Кодировка
    /// </summary>
    public Encoding? Encoding { get; set; }

    #endregion
}

