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
    string FormatFileSize(long fileSize);
    /// <summary>
    /// Получает предыдущий путь каталога 
    /// </summary>
    /// <param name="path">Путь к каталогу</param>
    /// <returns>Предыдущий каталог или NULL</returns>
    string? GetParentDirectory(string path);
}