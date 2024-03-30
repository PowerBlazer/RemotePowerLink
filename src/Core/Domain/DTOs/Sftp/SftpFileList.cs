namespace Domain.DTOs.Sftp;

public class SftpFileList
{
    /// <summary>
    /// Текцщий путть директории
    /// </summary>
    public required string CurrentPath { get; set; }
    /// <summary>
    /// Список файлов директории
    /// </summary>
    public required IList<SftpFileItem> FileList { get; set; }
}