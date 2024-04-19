using Domain.Entities;

namespace Domain.Repository;

public interface IEncodingRepository
{
    /// <summary>
    /// Получает все доступные кодировки.
    /// </summary>
    /// <returns>Коллекция объектов кодировок.</returns>
    Task<IEnumerable<Encoding>> GetEncodingsAsync();
    
    /// <summary>
    /// Получает информацию о кодировке по заданному идентификатору.
    /// </summary>
    /// <param name="encodingId">Идентификатор кодировки.</param>
    /// <returns>Объект кодировки.</returns>
    Task<Encoding> GetEncodingAsync(long encodingId);
}