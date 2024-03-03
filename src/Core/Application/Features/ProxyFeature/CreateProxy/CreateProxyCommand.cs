using Domain.DTOs.Proxy;
using MediatR;

namespace Application.Features.ProxyFeature.CreateProxy;

/// <summary>
/// Команда для создания новой записи прокси данных для подключения по SSH.
/// </summary>
public class CreateProxyCommand: IRequest<CreateProxyResponse>
{
    /// <summary>
    /// ID прокси сервера.
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
    public long UserId { get; set; }

    /// <summary>
    /// Id Идентификатор пользователя, связанных с прокси.
    /// </summary>
    public required long IdentityId { get; set; }
}
