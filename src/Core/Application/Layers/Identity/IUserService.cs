using Application.Layers.Identity.Models;

namespace Application.Layers.Identity;

public interface IUserService
{
    /// <summary>
    /// Получение информации о пользователя по его Id
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns></returns>
    Task<UserInformation> GetUserInformationAsync(long userId);
}