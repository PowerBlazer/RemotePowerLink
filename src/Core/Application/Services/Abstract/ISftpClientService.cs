using Application.Services.Abstract.Parameters;
using Renci.SshNet;

namespace Application.Services.Abstract;

public interface ISftpClientService
{
    /// <summary>
    /// Получает существующее подключение по SSH
    /// </summary>
    /// <param name="connectionKey">Строка подключения пользователя</param>
    /// <returns>Возвращает клиент SSH</returns>
    SftpClient? GetClient(string connectionKey);
    
    /// <summary>
    /// Создает новое подключение по SSH или возвращает существующее
    /// </summary>
    /// <param name="connectionServerParameter">Параметры для подключения по SSH</param>
    /// <param name="connectionKey">Строка подключения пользователя</param>
    /// <returns>Возвращает клиент SSH</returns>
    SftpClient CreateClient(ConnectionServerParameter connectionServerParameter, string connectionKey);
    
    /// <summary>
    /// Проверяет есть ли существующее подключение по строке подключения
    /// </summary>
    /// <param name="connectionKey">Строка подключения пользователя</param>
    /// <returns></returns>
    bool CheckExistingConnection(string connectionKey);
    
    /// <summary>
    /// Удаление существущего подключение SSH
    /// </summary>
    /// <param name="connectionKey">Строка подключения для отключения клиента SSH</param>
    void DisconnectClient(string connectionKey);
    
    /// <summary>
    /// Отключает неактивных SSH клиентов
    /// </summary>
    void DisconnectIdleClients();
}