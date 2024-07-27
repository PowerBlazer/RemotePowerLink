using Application.Layers.Identity.Models;
using Domain.DTOs.Authorization;
using Domain.DTOs.User;

namespace Application.Layers.Identity;

public interface IUserService
{
    /// <summary>
    /// Получение информации о пользователя по его Id
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns></returns>
    Task<UserInformation> GetUserInformation(long userId);
    
    /// <summary>
    /// Обновление пароля у пользователя
    /// </summary>
    /// <param name="updatePasswordRequest"></param>
    /// <returns></returns>
    Task UpdatePassword(UpdatePasswordRequest updatePasswordRequest);
    
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