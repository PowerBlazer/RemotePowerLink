namespace Domain.DTOs.Identity;

public class CreateIdentityResponse
{
    /// <summary>
    /// Id идентификатора
    /// </summary>
    public long IdentityId { get; set; }
    
    /// <summary>
    /// Название идентификации.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Имя пользователя для авторизации.
    /// </summary>
    public required string Username { get; set; }
    
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime DateCreated { get; set; }
    
    public static CreateIdentityResponse IdentityMapTo(Entities.Identity identity)
    {
        return new CreateIdentityResponse
        {
            IdentityId = identity.Id,
            Title = identity.Title,
            Username = identity.Username,
            DateCreated = identity.DateCreated
        };
    }
}