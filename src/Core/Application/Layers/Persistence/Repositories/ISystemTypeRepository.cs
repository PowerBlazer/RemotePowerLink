﻿using Domain.Entities;

namespace Application.Layers.Persistence.Repositories;

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
}