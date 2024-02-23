namespace Domain.DTOs.Proxy;

/// <summary>
/// Ответ на запрос получения информации о прокси сервере.
/// </summary>
public class GetProxyResponse
{
    /// <summary>
    /// Идентификатор прокси сервера.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Название или описание прокси сервера.
    /// </summary>
    public required string Title { get; set; }
}
