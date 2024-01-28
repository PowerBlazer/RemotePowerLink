using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

public interface IUserRepository
{
    /// <summary>
    /// Получение пользователя по Id
    /// </summary>
    /// <param name="userId">Id пользователя</param>
    /// <returns>Данные о пользователя</returns>
    Task<User> GetUserAsync(long userId);
}