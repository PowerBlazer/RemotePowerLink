using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

public interface IProxyRepository
{
    /// <summary>
    /// Получить список прокси пользователя
    /// </summary>
    /// <param name="userId">Id пользователя</param>
    /// <returns>Список прокси</returns>
    Task<IEnumerable<Proxy>> GetProxiesInUser(long userId);
}