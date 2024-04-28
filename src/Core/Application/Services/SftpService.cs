using Domain.Services;
using Renci.SshNet;

namespace Application.Services;

public class SftpService: ISftpService
{
    public string GetFileExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName);
        return extension.TrimStart('.').ToLowerInvariant();
    }
    public string FormatFileSize(ulong fileSize)
    {
        const int byteConversion = 1024;
        var bytes = Convert.ToDouble(fileSize);

        return true switch
        {
            _ when bytes >= Math.Pow(byteConversion, 3) => // Гигабайты
                $"{Math.Round(bytes / Math.Pow(byteConversion, 3), 2)} GB",
            _ when bytes >= Math.Pow(byteConversion, 2) => // Мегабайты
                $"{Math.Round(bytes / Math.Pow(byteConversion, 2), 2)} MB",
            _ when bytes >= byteConversion => // Килобайты
                $"{Math.Round(bytes / byteConversion, 2)} KB",
            _ => $"{bytes} bytes"
        };
    }
    public string? GetParentDirectory(string path)
    {
        // Если путь пуст или null, возвращаем null
        if (string.IsNullOrWhiteSpace(path))
            return null;

        // Заменяем все обратные слеши на прямые, чтобы обеспечить единообразие в путях
        path = path.Replace("\\", "/");

        // Удаляем последний слеш, если он есть, чтобы получить директорию
        if (path.EndsWith("/"))
            path = path.Substring(0, path.Length - 1);

        // Разделяем путь по слешу
        var parts = path.Split('/');

        // Если в пути меньше двух частей, возвращаем null
        if (parts.Length < 2)
            return null;

        // Формируем путь к родительскому каталогу
        var parentDirectory = string.Join("/", parts, 0, parts.Length - 1);

        // Если родительский каталог пустой, значит это корневой каталог, возвращаем его самого
        return string.IsNullOrEmpty(parentDirectory) ? "/" : parentDirectory;
    }
    public long GetDirectorySize(SftpClient client, string directoryPath)
    {
        long totalSize = 0;
        // Получаем список файлов и поддиректорий в директории
        var items = client.ListDirectory(directoryPath);
        foreach (var item in items)
        {
            // Игнорируем ссылки на текущую и родительскую директории
            if (item.Name == "." || item.Name == "..")
                continue;

            // Если поддиректория, рекурсивно считаем её размер
            if (item.IsDirectory)
            {
                totalSize += GetDirectorySize(client, item.FullName);
            }
            // Если файл, суммируем его размер
            else
            {
                totalSize += item.Length;
            }
        }

        return totalSize;
    }
}