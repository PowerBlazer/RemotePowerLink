using Application.Layers.Identity.Models;
using Domain.DTOs.Authorization;

namespace Application.Layers.Identity;

public interface IUserService
{
    /// <summary>
    /// Получение информации о пользователя по его Id
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns></returns>
    Task<UserInformation> GetUserInformationAsync(long userId);
    
    /// <summary>
    /// Обновление пароля у пользователя
    /// </summary>
    /// <param name="updatePasswordRequest"></param>
    /// <returns></returns>
    Task UpdatePassword(UpdatePasswordRequest updatePasswordRequest);
}