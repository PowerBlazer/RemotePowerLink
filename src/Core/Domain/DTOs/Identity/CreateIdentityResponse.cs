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
    /// Пароль для авторизации.
    /// </summary>
    public required string Password { get; set; }

    public static CreateIdentityResponse MapToIdentity(Entities.Identity identity)
    {
        return new CreateIdentityResponse
        {
            IdentityId = identity.Id,
            Title = identity.Title,
            Password = identity.Password,
            Username = identity.Username
        };
    }
}