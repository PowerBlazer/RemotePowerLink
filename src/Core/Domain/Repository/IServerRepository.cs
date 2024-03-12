using Domain.Entities;

namespace Domain.Repository;

public interface IServerRepository
{
    /// <summary>
    /// Получает информацию о сервере на основе предоставленного идентификатора сервера.
    /// </summary>
    /// <param name="serverId">Идентификатор сервера.</param>
    /// <returns>Объект сервер для подключения по SSH.</returns>
    Task<Server> GetServerAsync(long serverId);
    
    /// <summary>
    /// Получает информацию о сервере на основе предоставленного идентификатора сервера.
    /// </summary>
    /// <param name="serverId">Id сервера</param>
    /// <returns>Объект сервер для подключения по SSH или NULL если не найден</returns>
    Task<Server?> GetServerDefaultAsync(long serverId);

    /// <summary>
    /// Добавляет новый сервер в систему.
    /// </summary>
    /// <param name="server">Сервер для добавления.</param>
    /// <returns>Добавленный сервер.</returns>
    Task<Server> AddServerAsync(Server server);
    
    /// <summary>
    /// Получает список серверов для подключения по SSH, принадлежащих указанному пользователю.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Список серверов для подключения по SSH пользователя.</returns>
    Task<IEnumerable<Server>> GetServersInUser(long userId);
    
    /// <summary>
    /// Обновляет данные существующего сервера
    /// </summary>
    /// <param name="server">Сервер для обновления</param>
    /// <returns>Обновленный сервер</returns>
    Task<Server> UpdateServerAsync(Server server);
    
    /// <summary>
    /// Удаляет данные сервера
    /// </summary>
    /// <param name="serverId">Id сервера</param>
    /// <returns></returns>
    Task DeleteServerAsync(long serverId);


}