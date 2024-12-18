﻿namespace Application.Layers.Persistence.Repository;

public interface IIdentityRepository
{
    /// <summary>
    /// Получает идентификаторы пользователя на основе предоставленного идентификатора пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Коллекция идентификаторов пользователя.</returns>
    Task<IEnumerable<Domain.Entities.Identity>> GetIdentitiesInUser(long userId);

    /// <summary>
    /// Получает идентификатор по Identity Id.
    /// </summary>
    /// <param name="identityId">Идентификатор Identity.</param>
    /// <returns>Информация идентификаторы или null, если идентификатор не найден.</returns>
    Task<Domain.Entities.Identity?> GetIdentityDefault(long identityId);

    /// <summary>
    /// Получает идентификатор по Identity Id.
    /// </summary>
    /// <param name="identityId">Идентификатор Identity.</param>
    /// <returns>Идентификатор по указанному Id</returns>
    Task<Domain.Entities.Identity> GetIdentity(long identityId);

    /// <summary>
    /// Добавляет новую запись идентификатора в базу данных.
    /// </summary>
    /// <param name="identity">Идентификатор для добавления.</param>
    /// <returns>Добавленный идентификатор</returns>
    Task<Domain.Entities.Identity> AddIdentity(Domain.Entities.Identity identity);
    
    /// <summary>
    /// Обновляет запись идентификатора
    /// </summary>
    /// <param name="identity">Идентификатор для обновления</param>
    /// <returns>Обновленный идентификатор</returns>
    Task<Domain.Entities.Identity> UpdateIdentity(Domain.Entities.Identity identity);
    
    /// <summary>
    /// Удаляет идентификатор по его Id
    /// </summary>
    /// <param name="identityId">Id идентификатора</param>
    /// <returns></returns>
    Task DeleteIdentity(long identityId);

}
