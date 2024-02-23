namespace Domain.DTOs.Identity;

/// <summary>
/// Ответ на запрос получения информации об учетных данных (Identity).
/// </summary>
public class GetIdentityResponse
{
    /// <summary>
    /// Идентификатор учетных данных.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Название или описание учетных данных.
    /// </summary>
    public required string Title { get; set; }
}
