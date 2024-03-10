namespace Domain.DTOs.Identity;

public class EditIdentityResponse
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
    
    public static EditIdentityResponse IdentityMapTo(Entities.Identity identity)
    {
        return new EditIdentityResponse
        {
            IdentityId = identity.Id,
            Title = identity.Title,
            Username = identity.Username
        };
    }
}