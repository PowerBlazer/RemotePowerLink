using System.Text.Json.Serialization;
using Domain.DTOs.Proxy;
using Domain.Entities;
using MediatR;

namespace Application.Features.ProxyFeature.EditProxy;

/// <summary>
/// Команда для обновление записи прокси данных для подключения по SSH.
/// </summary>
public class EditProxyCommand: IRequest<EditProxyResponse>
{
    /// <summary>
    /// Id прокси сервера
    /// </summary>
    public required long ProxyId { get; set; }
    
    /// <summary>
    /// Ip прокси сервера.
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
    /// Id пользователя, которому принадлежит прокси.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }

    /// <summary>
    /// Id Идентификатор пользователя, связанных с прокси.
    /// </summary>
    public required long IdentityId { get; set; }

    public static Proxy MapToProxy(EditProxyCommand editProxyCommand)
    {
        return new Proxy
        {
            Id = editProxyCommand.ProxyId,
            UserId = editProxyCommand.UserId,
            IdentityId = editProxyCommand.IdentityId,
            Title = editProxyCommand.Title,
            IpAddress = editProxyCommand.Hostname,
            SshPort = editProxyCommand.SshPort
        };
    }
}