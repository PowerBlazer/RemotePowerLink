using System.Text.Json.Serialization;
using Domain.DTOs.Proxy;
using Domain.Entities;
using MediatR;

namespace Application.Features.ProxyFeature.CreateProxy;

/// <summary>
/// Команда для создания новой записи прокси данных для подключения по SSH.
/// </summary>
public class CreateProxyCommand: IRequest<CreateProxyResponse>
{
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

    public static Proxy MapToProxy(CreateProxyCommand createProxyCommand)
    {
        return new Proxy
        {
            IpAddress = createProxyCommand.Hostname,
            DateCreated = DateTime.Now,
            IdentityId = createProxyCommand.IdentityId,
            SshPort = createProxyCommand.SshPort,
            Title = createProxyCommand.Title,
            UserId = createProxyCommand.UserId
        };
    }
    
}
