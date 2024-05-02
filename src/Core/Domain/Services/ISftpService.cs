using Renci.SshNet;

namespace Domain.Services;

public interface ISftpService
{
    /// <summary>
    /// Получает формат файла 
    /// </summary>
    /// <param name="fileName">Путь к файлу</param>
    /// <returns>Формат файла</returns>
    string GetFileExtension(string fileName);
    /// <summary>
    /// Получает форматированный размер файла
    /// </summary>
    /// <param name="fileSize">Размер файла в байтах</param>
    /// <returns>Строка с размером файла</returns>
    string FormatFileSize(ulong fileSize);
    /// <summary>
    /// Получает предыдущий путь каталога 
    /// </summary>
    /// <param name="path">Путь к каталогу</param>
    /// <returns>Предыдущий каталог или NULL</returns>
    string? GetParentDirectory(string path);
    /// <summary>
    /// Получает размер папки 
    /// </summary>
    /// <param name="client">Клиент для получение данных о размере файлов</param>
    /// <param name="directoryPath">Путь к директории</param>
    /// <returns>Размер папки в байтах (long)</returns>
    long GetDirectorySize(SftpClient client, string directoryPath);
    
    /// <summary>
    /// Форматирует время в строку
    /// </summary>
    /// <param name="time">Время TimeSpan</param>
    /// <returns>Форматированное время (string)</returns>
    string FormatTime(TimeSpan time);
}