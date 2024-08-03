namespace Domain.DTOs.User;

/// <summary>
/// Ответ на запрос получения информации о пользователе.
/// </summary>
public class UserData
{
    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    public long UserId { get; set; }

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    public required string Username { get; set; }
    
    /// <summary>
    /// Почта пользователя
    /// </summary>
    public string? Email { get; set; }
    
    /// <summary>
    /// Номер телефона
    /// </summary>
    public string? PhoneNumber { get; set; }
    
    /// <summary>
    /// Дата создания аккаунта
    /// </summary>
    public DateTimeOffset DateCreated { get; set; }
    
    /// <summary>
    /// Состояние подтверждение почты
    /// </summary>
    public bool EmailConfirmed { get; set; }
    
    /// <summary>
    /// Состояние двухфакторной авторизации
    /// </summary>
    public bool TwoFactorEnabled { get; set; }

    public static UserData MapUserTo(Entities.User user)
    {
        return new UserData
        {
            UserId = user.UserId,
            Username = user.Username
        };
    }
}
