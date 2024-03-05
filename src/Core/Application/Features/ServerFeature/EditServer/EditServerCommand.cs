using System.Text.Json.Serialization;
using Domain.DTOs.Server;
using Domain.Entities;
using MediatR;

namespace Application.Features.ServerFeature.EditServer;

/// <summary>
/// Команда для редактирования существующего сервера.
/// </summary>
public class EditServerCommand: IRequest<EditServerResponse>
{
    /// <summary>
    /// Идентификатор сервера
    /// </summary>
    public required long ServerId { get;set; }
    
    /// <summary>
    /// Заголовок сервера.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// IP-адрес сервера.
    /// </summary>
    public required string Hostname { get; set; }

    /// <summary>
    /// Порт для подключения по SSH.
    /// </summary>
    public int? SshPort { get; set; }

    /// <summary>
    /// Команда запуска для сервера.
    /// </summary>
    public string? StartupCommand { get; set; }
    
    /// <summary>
    /// Id идентификатора сервера.
    /// </summary>
    public required long IdentityId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, которому принадлежит сервер.
    /// </summary>
    [JsonIgnore]
    public required long UserId { get; set; }
    
    /// <summary>
    /// Идентификатор прокси сервера.
    /// </summary>
    public long? ProxyId { get; set; }

    public static Server MapToServer(EditServerCommand editServerCommand, long systemTypeId)
    {
        return new Server
        {
            Id = editServerCommand.ServerId,
            Title = editServerCommand.Title,
            IpAddress = editServerCommand.Hostname,
            SshPort = editServerCommand.SshPort,
            StartupCommand = editServerCommand.StartupCommand,
            IdentityId = editServerCommand.IdentityId,
            ProxyId = editServerCommand.ProxyId,
            UserId = editServerCommand.UserId,
            SystemTypeId = systemTypeId
        };
    }
    
}
