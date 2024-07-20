using Application.Services.Abstract.Parameters;
using Application.Services.Abstract.Results;
using Renci.SshNet;

namespace Application.Services.Abstract;

public interface IServerService
{
    /// <summary>
    /// Получает тип операционной системы сервера на основе предоставленной конфигурации.
    /// </summary>
    /// <param name="serverParameter">Конфигурация сервера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Тип операционной системы сервера</returns>
    public Task<SystemTypeResult> GetSystemType(ConnectionServerParameter serverParameter, CancellationToken cancellationToken);

    /// <summary>
    /// Проверяет подключение к серверу на основе предоставленной конфигурации.
    /// </summary>
    /// <param name="serverParameter">Конфигурация сервера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Возвращает значение true, если подключение успешно, в противном случае — false.</returns>
    public Task<bool> CheckConnectionServer(ConnectionServerParameter serverParameter, CancellationToken cancellationToken);
    
    /// <summary>
    /// Проверяет строку, представляющую собой доменное имя или IP-адрес с портом, на соответствие заданному шаблону.
    /// </summary>
    /// <param name="serverAddress">Строка, содержащая доменное имя или IP-адрес с портом.</param>
    /// <returns>Значение true, если строка соответствует заданному шаблону, в противном случае — false.</returns>
    public bool ValidateServerAddress(string serverAddress);

    /// <summary>
    /// Получает конфигурацию подключения по SSH
    /// </summary>
    /// <param name="connectionServerParameter">Параметры для подключения</param>
    /// <returns></returns>
    public ConnectionInfo GetConnectionInfo(ConnectionServerParameter connectionServerParameter);
}