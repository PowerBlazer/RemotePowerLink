using Domain.Services;

namespace Application.Services;

public class SftpService: ISftpService
{
    public string GetFileExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName);
        return extension.TrimStart('.').ToLowerInvariant();
    }

    public string FormatFileSize(long fileSize)
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
}