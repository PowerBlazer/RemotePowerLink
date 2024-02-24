using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

public interface IProxyRepository
{
    /// <summary>
    /// Получает список прокси данных для подключения по SSH, принадлежащих указанному пользователю.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Список прокси данных для подключения по SSH пользователя.</returns>
    Task<IEnumerable<Proxy>> GetProxiesInUser(long userId);

    /// <summary>
    /// Получает прокси данные для подключения по SSH по указанному идентификатору.
    /// </summary>
    /// <param name="proxyId">Идентификатор прокси данных для подключения по SSH.</param>
    /// <returns>Прокси данные для подключения по SSH с указанным идентификатором или null, если прокси не найдено.</returns>
    Task<Proxy?> GetProxyDefaultAsync(long proxyId);
    
    /// <summary>
    /// Добавляет новую запись прокси данных для подключения по SSH в репозиторий.
    /// </summary>
    /// <param name="proxy">Прокси данные для подключения по SSH для добавления.</param>
    /// <returns>Добавленный объект прокси данных для подключения по SSH.</returns>
    Task<Proxy> AddProxyAsync(Proxy proxy);
}
