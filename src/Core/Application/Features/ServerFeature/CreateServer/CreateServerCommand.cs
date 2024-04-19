using System.Text.Json.Serialization;
using Domain.DTOs.Server;
using Domain.Entities;
using MediatR;

namespace Application.Features.ServerFeature.CreateServer;

/// <summary>
/// Команда для создания нового сервера.
/// </summary>
public class CreateServerCommand : IRequest<CreateServerResponse>
{
    /// <summary>
    /// Имя хоста сервера.
    /// </summary>
    public required string Hostname { get; set; }

    /// <summary>
    /// Название сервера.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Порт сервера.
    /// </summary>
    public int? SshPort { get; set; }

    /// <summary>
    /// Команда запуска сервера.
    /// </summary>
    public string? StartupCommand { get; set; }

    /// <summary>
    /// Идентификатор пользователя, связанного с сервером.
    /// </summary>
    public required long IdentityId { get; set; }

    /// <summary>
    /// Идентификатор пользователя, создающего сервер (не сериализуется).
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }

    /// <summary>
    /// Идентификатор прокси, связанного с сервером.
    /// </summary>
    public long? ProxyId { get; set; }
    
    /// <summary>
    /// Идентификатор кодировки
    /// </summary>
    public long EncodingId { get; set; }

    public static Server MapToServer(CreateServerCommand createServerCommand, long systemTypeId)
    {
        return new Server
        {
            Title = createServerCommand.Title,
            IpAddress = createServerCommand.Hostname,
            SshPort = createServerCommand.SshPort,
            StartupCommand = createServerCommand.StartupCommand,
            IdentityId = createServerCommand.IdentityId,
            UserId = createServerCommand.UserId,
            ProxyId = createServerCommand.ProxyId,
            DateCreated = DateTime.Now,
            SystemTypeId = systemTypeId,
            EncodingId = createServerCommand.EncodingId
        };
    }
}