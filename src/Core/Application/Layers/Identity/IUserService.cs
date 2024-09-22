using Application.Layers.Identity.Models;
using UserData = Application.Layers.Identity.Models.UserData;

namespace Application.Layers.Identity;

public interface IUserService
{
    /// <summary>
    /// Получение информации о пользователя
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns></returns>
    Task<UserData> GetUserData(long userId);

    /// <summary>
    /// Обновление информации о пользователя
    /// </summary>
    /// <returns>Обновленная информация о пользователя</returns>
    Task<UserData> UpdateUserData(UpdateUserDataInput updateUserDataInput);
    
    /// <summary>
    /// Обновление пароля у пользователя
    /// </summary>
    /// <param name="updatePasswordInput"></param>
    /// <returns></returns>
    Task UpdatePassword(UpdatePasswordInput updatePasswordInput);

}