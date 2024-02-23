using Application.Layers.Persistence.Services.Parameters.CheckConnectionServer;
using Application.Layers.Persistence.Services.Parameters.GetSystemType;
using Domain.Enums;

namespace Application.Layers.Persistence.Services;

public interface IHostService
{
    /// <summary>
    /// Получает тип операционной системы сервера на основе предоставленной конфигурации.
    /// </summary>
    /// <param name="serverParameter">Конфигурация сервера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Тип операционной системы сервера (enum SystemTypeEnum), или null, если тип не удалось определить.</returns>
    public Task<SystemTypeEnum?> GetSystemType(GetSystemServerTypeParameter serverParameter, CancellationToken cancellationToken);

    /// <summary>
    /// Проверяет подключение к серверу на основе предоставленной конфигурации.
    /// </summary>
    /// <param name="serverParameter">Конфигурация сервера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Возвращает значение true, если подключение успешно, в противном случае — false.</returns>
    public Task<bool> CheckConnectionServer(CheckConnectionServerParameter serverParameter, CancellationToken cancellationToken);
    
    /// <summary>
    /// Проверяет строку, представляющую собой доменное имя или IP-адрес с портом, на соответствие заданному шаблону.
    /// </summary>
    /// <param name="serverAddress">Строка, содержащая доменное имя или IP-адрес с портом.</param>
    /// <returns>Значение true, если строка соответствует заданному шаблону, в противном случае — false.</returns>
    public bool ValidateServerAddress(string serverAddress);
}