using Domain.Entities;

namespace Domain.Repository;

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
    
    /// <summary>
    /// Создает нового пользователя
    /// </summary>
    /// <param name="user">Данные о пользователе</param>
    /// <returns>Возвращает данные о созданном пользователя</returns>
    Task<User> AddUserAsync(User user);
}