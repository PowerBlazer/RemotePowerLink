namespace Domain.DTOs.Proxy;

/// <summary>
/// Ответ на запрос получения информации о прокси сервере.
/// </summary>
public class GetProxyResponse
{
    /// <summary>
    /// Идентификатор прокси сервера.
    /// </summary>
    public long ProxyId { get; set; }

    /// <summary>
    /// Имя хоста прокси сервера.
    /// </summary>
    public required string Hostname { get; set; }

    /// <summary>
    /// Порт SSH прокси сервера.
    /// </summary>
    public int? SshPort { get; set; }

    /// <summary>
    /// Идентификатор пользователя, связанного с прокси сервером.
    /// </summary>
    public required long IdentityId { get; set; }

    /// <summary>
    /// Название или описание прокси сервера.
    /// </summary>
    public required string Title { get; set; }

    public static GetProxyResponse MapProxyTo(Entities.Proxy proxy)
    {
        return new GetProxyResponse
        {
            ProxyId = proxy.Id,
            Hostname = proxy.IpAddress,
            IdentityId = proxy.IdentityId,
            SshPort = proxy.SshPort,
            Title = proxy.Title
        };
    }
}
