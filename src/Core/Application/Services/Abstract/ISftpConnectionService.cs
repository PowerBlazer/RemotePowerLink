using Domain.DTOs.Connection;
using Renci.SshNet;

namespace Application.Services.Abstract;

public interface ISftpConnectionService
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
    /// <param name="connectionServer">Параметры для подключения по SSH</param>
    /// <param name="connectionKey">Строка подключения пользователя</param>
    /// <returns>Возвращает клиент SSH</returns>
    SftpClient CreateClient(ConnectionServer connectionServer, string connectionKey);
    
    /// <summary>
    /// Проверяет есть ли существующее подключение по строке подключения
    /// </summary>
    /// <param name="connectionKey">Строка подключения пользователя</param>
    /// <returns></returns>
    bool CheckExistingConnection(string connectionKey);
    
    /// <summary>
    /// Удаление существующего подключение SSH
    /// </summary>
    /// <param name="connectionKey">Строка подключения для отключения клиента SSH</param>
    void DisconnectClient(string connectionKey);
    
    /// <summary>
    /// Отключает неактивных SSH клиентов
    /// </summary>
    void DisconnectIdleClients();
}