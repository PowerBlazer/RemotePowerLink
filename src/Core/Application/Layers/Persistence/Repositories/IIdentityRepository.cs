namespace Application.Layers.Persistence.Repositories;

public interface IIdentityRepository
{
    /// <summary>
    /// Получает учетные данные пользователя на основе предоставленного идентификатора пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Коллекция учетных данных пользователя.</returns>
    Task<IEnumerable<Domain.Entities.Identity>> GetIdentitiesInUser(long userId);

    /// <summary>
    /// Получает учетную информацию по идентификатору Identity.
    /// </summary>
    /// <param name="identityId">Идентификатор Identity.</param>
    /// <returns>Учетная информация по указанному идентификатору или null, если идентификатор не найден.</returns>
    Task<Domain.Entities.Identity?> GetIdentityDefaultAsync(long identityId);

    /// <summary>
    /// Получает учетную информацию по идентификатору Identity.
    /// </summary>
    /// <param name="identityId">Идентификатор Identity.</param>
    /// <returns>Учетная информация по указанному идентификатору</returns>
    Task<Domain.Entities.Identity> GetIdentityAsync(long identityId);

}
