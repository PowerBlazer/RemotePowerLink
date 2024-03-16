using Domain.Services.Parameters;
using Renci.SshNet;

namespace Domain.Services;

public interface ISftpClientService
{
    /// <summary>
    /// Получает существующее подключение по SSH или создает его
    /// </summary>
    /// <param name="connectionServerParameter">Данные для подключения по SSH</param>
    /// <returns>Возвращает клиент SSH</returns>
    SftpClient GetClient(ConnectionServerParameter connectionServerParameter);
    
    /// <summary>
    /// Удаление существущего подключение SSH
    /// </summary>
    /// <param name="connectionServerParameter">Данные для отключения по SSH</param>
    void DisconnectClient(ConnectionServerParameter connectionServerParameter);
}