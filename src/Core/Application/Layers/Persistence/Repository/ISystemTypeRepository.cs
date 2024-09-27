using Domain.Entities;

namespace Application.Layers.Persistence.Repository;

/// <summary>
/// Интерфейс репозитория для получения типа системы по умолчанию.
/// </summary>
public interface ISystemTypeRepository
{
    /// <summary>
    /// Получает тип системы по умолчанию асинхронно.
    /// </summary>
    /// <param name="systemTypeId">Идентификатор типа системы.</param>
    /// <returns>Объект типа системы или null, если не найден.</returns>
    Task<SystemType?> GetSystemTypeDefault(long systemTypeId);

    /// <summary>
    /// Получает тип системы асинхронно.
    /// </summary>
    /// <param name="systemTypeId">Идентификатор типа системы.</param>
    /// <returns>Объект типа системы</returns>
    Task<SystemType> GetSystemType(long systemTypeId);
}
