using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

public interface IServerRepository
{
    /// <summary>
    /// Получает информацию о сервере на основе предоставленного идентификатора сервера.
    /// </summary>
    /// <param name="serverId">Идентификатор сервера.</param>
    /// <returns>Объект сервера с указанным идентификатором.</returns>
    Task<Server> GetServerAsync(long serverId);

    /// <summary>
    /// Добавляет новый сервер в систему.
    /// </summary>
    /// <param name="server">Сервер для добавления.</param>
    /// <returns>Добавленный сервер.</returns>
    Task<Server> AddServerAsync(Server server);


}