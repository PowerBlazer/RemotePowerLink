using Domain.Entities.Abstractions;

namespace Domain.Entities;

/// <summary>
/// Представляют информацию о сессии
/// </summary>
public class Session: BaseEntity<long>
{
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime DateCreated { get; set; }
    
    /// <summary>
    /// Дата обновления
    /// </summary>
    public DateTime DateUpdated { get; set; }
    
    /// <summary>
    /// Путь к фалу где хранится данные сессии
    /// </summary>
    public string? Path { get; set; }
    
    #region Relationships
    /// <summary>
    /// Id пользователя
    /// </summary>
    public required long UserId { get; set; }
    
    /// <summary>
    /// Объект пользователя
    /// </summary>
    public User? User { get; set; }

    /// <summary>
    /// Id сервера
    /// </summary>
    public long ServerId { get; set; }
    
    /// <summary>
    /// Объект сервер
    /// </summary>
    public Server? Server { get; set; }
   
    #endregion
}