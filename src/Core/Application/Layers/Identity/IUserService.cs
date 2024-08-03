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
    /// <param name="updatePasswordInput">Новые данные пользователя</param>
    /// <returns>Обновленная информация о пользователя</returns>
    Task<UserData> UpdateUserData(UpdateUserDataInput updateUserDataInput);
    
    /// <summary>
    /// Обновление пароля у пользователя
    /// </summary>
    /// <param name="updatePasswordInput"></param>
    /// <returns></returns>
    Task UpdatePassword(UpdatePasswordInput updatePasswordInput);
    
    /// <summary>
    /// Отправляет код, для сброса пароля пользователя
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>ID созданной сессии</returns>
    Task<string> SendCodeResetPassword(long userId);

    /// <summary>
    /// Подтверждает операцию сброса пароля с помощью кода верификации
    /// </summary>
    /// <param name="sessionId">Идентификатор сессии</param>
    /// <param name="verifyCode">Код подтверждения</param>
    /// <returns></returns>
    Task VerifyResetPasswordCode(string sessionId, string verifyCode);

    /// <summary>
    /// Повторно отправляет код, для сброса пароля пользователя
    /// </summary>
    /// <param name="sessionId">Идентификатор сессии</param>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns></returns>
    Task<string> ResendResetPasswordCode(string sessionId, long userId);

}