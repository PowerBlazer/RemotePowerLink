using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

public interface IProxyRepository
{
    /// <summary>
    /// Получает список прокси пользователя на основе предоставленного идентификатора пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Список прокси, принадлежащих пользователю.</returns>
    Task<IEnumerable<Proxy>> GetProxiesInUser(long userId);

    /// <summary>
    /// Получает прокси по указанному идентификатору.
    /// </summary>
    /// <param name="proxyId">Идентификатор прокси.</param>
    /// <returns>Прокси с указанным идентификатором или null, если прокси не найдено.</returns>
    Task<Proxy?> GetProxyDefaultAsync(long proxyId);

}