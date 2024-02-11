namespace Application.Layers.Persistence.Repositories;

public interface IIdentityRepository
{
    /// <summary>
    /// Получение учетных данных пользователя
    /// </summary>
    /// <param name="userId">Id пользователя</param>
    /// <returns>Учетные данные пользователя</returns>
    Task<IEnumerable<Domain.Entities.Identity>> GetIdentitiesInUser(long userId);
}
