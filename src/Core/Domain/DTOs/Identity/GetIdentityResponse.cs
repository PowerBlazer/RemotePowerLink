namespace Domain.DTOs.Identity;

/// <summary>
/// Ответ на запрос получения информации об идентификаторов (Identity).
/// </summary>
public class GetIdentityResponse
{
    /// <summary>
    /// Id идентификатора.
    /// </summary>
    public long IdentityId { get; set; }

    /// <summary>
    /// Название или описание идентификатора.
    /// </summary>
    public required string Title { get; set; }
    
    /// <summary>
    /// Имя пользователя идентификатора
    /// </summary>
    public required string Username { get; set; }
    
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime DateCreated { get; set; }

    public static GetIdentityResponse MapIdentityTo(Entities.Identity identity)
    {
        return new GetIdentityResponse
        {
            IdentityId = identity.Id,
            Title = identity.Title,
            Username = identity.Username,
            DateCreated = identity.DateCreated
        };
    }
}
