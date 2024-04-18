using System.Text.Json.Serialization;
using Domain.DTOs.Sftp;
using MediatR;

namespace Application.Features.SftpFeature.DeleteFoldersOrFiles;

/// <summary>
/// Команда для удаления файлов или папок через SFTP.
/// </summary>
public class DeleteFoldersOrFilesCommand: IRequest
{
    /// <summary>
    /// Список файлов или папок для удаления.
    /// </summary>
    public required List<SftpFileItem> FilesOrFoldersToDeleteList { get; set; }
    
    /// <summary>
    /// Идентификатор сервера, на котором будут удалены файлы.
    /// </summary>
    public required long ServerId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, инициирующего удаление файлов.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}
