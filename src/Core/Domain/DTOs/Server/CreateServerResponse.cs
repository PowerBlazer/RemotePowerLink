namespace Domain.DTOs.Server;

/// <summary>
/// Ответ на запрос создания нового сервера.
/// </summary>
public class CreateServerResponse
{
    /// <summary>
    /// Идентификатор сервера
    /// </summary>
    public required long ServerId { get; set; }
    /// <summary>
    /// Хостное имя (адрес) нового сервера.
    /// </summary>
    public required string Hostname { get; set; }

    /// <summary>
    /// Название или описание нового сервера.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Порт ssh для подключения к серверу.
    /// </summary>
    public int? SshPort { get; set; }

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
    /// <summary>
    /// Название операционной системы сервера
    /// </summary>
    public string? SystemTypeName { get; set; }
    /// <summary>
    /// Путь к иконке типа системы
    /// </summary>
    public string? SystemTypeIcon { get; set; }
    
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime DateCreated { get; set; }
    
    /// <summary>
    /// Идентификатор кодировки
    /// </summary>
    public long EncodingId { get; set; }


    public static CreateServerResponse MapToServer(Entities.Server server)
    {
        return new CreateServerResponse
        {
            ServerId = server.Id,
            Hostname = server.IpAddress,
            IdentityId = server.IdentityId,
            SshPort = server.SshPort,
            Title = server.Title,
            ProxyId = server.ProxyId,
            StartupCommand = server.StartupCommand,
            SystemTypeName = server.SystemType?.Name,
            SystemTypeIcon = server.SystemType?.IconPath,
            DateCreated = server.DateCreated,
            EncodingId = server.EncodingId
        };
    }
}
