using Domain.Entities;

namespace Domain.Repository;

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
    Task<SystemType?> GetSystemTypeDefaultAsync(long systemTypeId);

    /// <summary>
    /// Получает тип системы асинхронно.
    /// </summary>
    /// <param name="systemTypeId">Идентификатор типа системы.</param>
    /// <returns>Объект типа системы</returns>
    Task<SystemType> GetSystemTypeAsync(long systemTypeId);
}
