using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

public interface IUserRepository
{
    /// <summary>
    /// Получает данные о пользователе на основе предоставленного идентификатора пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Данные о пользователе с указанным идентификатором.</returns>
    Task<User> GetUserAsync(long userId);

    /// <summary>
    /// Получает данные о пользователе по указанному идентификатору.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Данные о пользователе с указанным идентификатором, или null, если пользователь не найден.</returns>
    Task<User?> GetUserDefaultAsync(long userId);
}