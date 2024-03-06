namespace Domain.DTOs.Proxy;

public class EditProxyResponse
{
    /// <summary>
    /// Id прокси сервера.
    /// </summary>
    public long ProxyId { get; set; }
    /// <summary>
    /// IP прокси сервера.
    /// </summary>
    public required string Hostname { get; set; }

    /// <summary>
    /// Порт прокси сервера.
    /// </summary>
    public int? SshPort { get; set; }

    /// <summary>
    /// Наименование прокси сервера.
    /// </summary>
    public required string Title { get; set; }
    
    /// <summary>
    /// Id идентификатора, связанный с прокси.
    /// </summary>
    public required long IdentityId { get; set; }
    
    public static EditProxyResponse ProxyMapTo(Entities.Proxy proxy)
    {
        return new EditProxyResponse
        {
            ProxyId = proxy.Id,
            Hostname = proxy.IpAddress,
            SshPort = proxy.SshPort,
            Title = proxy.Title,
            IdentityId = proxy.IdentityId
        };
    }
}