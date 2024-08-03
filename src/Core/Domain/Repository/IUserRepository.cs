using Domain.Entities;

namespace Domain.Repository;

public interface IUserRepository
{
    /// <summary>
    /// Получает данные о пользователе на основе предоставленного идентификатора пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Данные о пользователе с указанным идентификатором.</returns>
    Task<User> GetUser(long userId);

    /// <summary>
    /// Получает данные о пользователе по указанному идентификатору.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Данные о пользователе с указанным идентификатором, или null, если пользователь не найден.</returns>
    Task<User?> GetUserDefault(long userId);
    
    /// <summary>
    /// Создает нового пользователя
    /// </summary>
    /// <param name="user">Данные о пользователе</param>
    /// <returns>Возвращает данные о созданном пользователя</returns>
    Task<User> AddUser(User user);
    
    /// <summary>
    /// Обновление пользователя
    /// </summary>
    /// <param name="user">Данные о пользователе</param>
    /// <returns>Возвращает данные о обновленном пользователя</returns>
    Task<User> UpdateUser(User user);
}