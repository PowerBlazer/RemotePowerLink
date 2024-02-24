using Domain.Entities.Abstractions;

namespace Domain.Entities;

/// <summary>
/// Информация для авторизации по протоколу SSH.
/// </summary>
public class Identity : BaseEntity<long>
{
    /// <summary>
    /// Название идентификатора.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Имя пользователя для авторизации.
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Пароль для авторизации.
    /// </summary>
    public required string Password { get; set; }
    
    /// <summary>
    /// Дата и время создания учетки
    /// </summary>
    public DateTime DateCreated { get; set; }

    #region Relationships

    /// <summary>
    /// Идентификатор пользователя, связанного с этой идентификацией.
    /// </summary>
    public required long UserId { get; set; }

    /// <summary>
    /// Пользователь, связанный с этой идентификацией.
    /// </summary>
    public User? User { get; set; }

    /// <summary>
    /// Список прокси, связанных с этой идентификацией.
    /// </summary>
    public IList<Proxy>? Proxies { get; set; }

    /// <summary>
    /// Список серверов, связанных с этой идентификацией.
    /// </summary>
    public IList<Server>? Servers { get; set; }

    #endregion
}
