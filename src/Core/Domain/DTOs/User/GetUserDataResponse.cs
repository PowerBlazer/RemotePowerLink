namespace Domain.DTOs.User;

/// <summary>
/// Ответ на запрос получения информации о пользователе.
/// </summary>
public class GetUserDataResponse
{
    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    public long UserId { get; set; }

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    public required string Username { get; set; }

    public static GetUserDataResponse MapUserTo(Entities.User user)
    {
        return new GetUserDataResponse
        {
            UserId = user.UserId,
            Username = user.Username
        };
    }
}
