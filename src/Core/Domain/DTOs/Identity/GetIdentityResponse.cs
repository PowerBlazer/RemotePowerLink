namespace Domain.DTOs.Identity;

/// <summary>
/// Ответ на запрос получения информации об идентификаторов (Identity).
/// </summary>
public class GetIdentityResponse
{
    /// <summary>
    /// Id идентификатора.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Название или описание идентификатора.
    /// </summary>
    public required string Title { get; set; }
}
