using Domain.DTOs.Server;
using MediatR;

namespace Application.Features.ServerFeature.GetServers;

/// <summary>
/// Команда для получения списка серверов пользователя.
/// </summary>
public class GetServersCommand : IRequest<IEnumerable<GetServerResponse>>
{
    public GetServersCommand(long userId)
    {
        UserId = userId;
    }
    
    /// <summary>
    /// Получает или устанавливает идентификатор пользователя.
    /// </summary>
    public long UserId { get; }
}