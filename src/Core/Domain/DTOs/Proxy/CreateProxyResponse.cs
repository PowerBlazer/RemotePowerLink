﻿namespace Domain.DTOs.Proxy;

public class CreateProxyResponse
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
    public int? Port { get; set; }

    /// <summary>
    /// Наименование прокси сервера.
    /// </summary>
    public required string Title { get; set; }
    
    /// <summary>
    /// Id идентификатора, связанный с прокси.
    /// </summary>
    public required long IdentityId { get; set; }
    
    public static CreateProxyResponse MapToProxy(Entities.Proxy proxy)
    {
        return new CreateProxyResponse
        {
            ProxyId = proxy.Id,
            Hostname = proxy.IpAddress,
            Port = proxy.Port,
            Title = proxy.Title,
            IdentityId = proxy.IdentityId
        };
    }
}