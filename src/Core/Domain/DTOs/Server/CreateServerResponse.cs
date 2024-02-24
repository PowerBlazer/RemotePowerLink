namespace Domain.DTOs.Server;

/// <summary>
/// Ответ на запрос создания нового сервера.
/// </summary>
public class CreateServerResponse
{
    /// <summary>
    /// Хостное имя (адрес) нового сервера.
    /// </summary>
    public required string Hostname { get; set; }

    /// <summary>
    /// Название или описание нового сервера.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Порт для подключения к серверу.
    /// </summary>
    public int? Port { get; set; }

    /// <summary>
    /// Команда для запуска при старте сервера.
    /// </summary>
    public string? StartupCommand { get; set; }

    /// <summary>
    /// Id идентификатора (Identity) сервера.
    /// </summary>
    public required long IdentityId { get; set; }

    /// <summary>
    /// Идентификатор прокси сервера.
    /// </summary>
    public long? ProxyId { get; set; }


    public static CreateServerResponse MapToServer(Entities.Server server)
    {
        return new CreateServerResponse
        {
            Hostname = server.IpAddress,
            IdentityId = server.IdentityId,
            Port = server.Port,
            Title = server.Title,
            ProxyId = server.ProxyId,
            StartupCommand = server.StartupCommand
        };
    }
}
