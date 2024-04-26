using System.Text.Json.Serialization;
using Domain.DTOs.Sftp;
using MediatR;

namespace Application.Features.SftpFeature.DownloadFoldersOrFiles;

public class DownloadFoldersOrFilesCommand: IRequest<string>
{
    /// <summary>
    /// Список файлов или папок для удаления.
    /// </summary>
    public required List<SftpFileItem> FilesOrFoldersToDownloadList { get; set; }
    
    /// <summary>
    /// Идентификатор сервера, с которого будет скачаны файлы и папки.
    /// </summary>
    public required long ServerId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, инициирующего удаление файлов.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
    
    /// <summary>
    /// Путь к директории временных файлов
    /// </summary>
    public string? TempPath { get; set; }
}