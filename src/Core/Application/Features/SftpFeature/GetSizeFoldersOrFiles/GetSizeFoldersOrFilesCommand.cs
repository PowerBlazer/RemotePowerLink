using System.Text.Json.Serialization;
using Domain.DTOs.Sftp;
using MediatR;

namespace Application.Features.SftpFeature.GetSizeFoldersOrFiles;

/// <summary>
/// Команда для получения размеров папок и файлов
/// </summary>
public class GetSizeFoldersOrFilesCommand: IRequest<ulong>
{
    /// <summary>
    /// Список файлов или папок для получения размера.
    /// </summary>
    public required List<SftpFileItem> FoldersOrFiles { get; set; }
    
    /// <summary>
    /// Идентификатор сервера.
    /// </summary>
    public required long ServerId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}