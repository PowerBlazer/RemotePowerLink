using Application.Services.Abstract.Results;
using Domain.DTOs.Connection;
using Renci.SshNet;

namespace Application.Services.Abstract;

public interface IServerService
{
    /// <summary>
    /// Получает тип операционной системы сервера на основе предоставленной конфигурации.
    /// </summary>
    /// <param name="server">Конфигурация сервера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Тип операционной системы сервера</returns>
    public Task<SystemTypeResult> GetSystemType(ConnectionServer server, CancellationToken cancellationToken);

    /// <summary>
    /// Проверяет подключение к серверу на основе предоставленной конфигурации.
    /// </summary>
    /// <param name="server">Конфигурация сервера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Возвращает значение true, если подключение успешно, в противном случае — false.</returns>
    public Task<bool> CheckConnectionServer(ConnectionServer server, CancellationToken cancellationToken);
    
    /// <summary>
    /// Проверяет строку, представляющую собой доменное имя или IP-адрес с портом, на соответствие заданному шаблону.
    /// </summary>
    /// <param name="serverAddress">Строка, содержащая доменное имя или IP-адрес с портом.</param>
    /// <returns>Значение true, если строка соответствует заданному шаблону, в противном случае — false.</returns>
    public bool ValidateServerAddress(string serverAddress);
}