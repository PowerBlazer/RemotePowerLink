using System.Text.Json.Serialization;
using Domain.DTOs.Sftp;
using MediatR;

namespace Application.Features.SftpFeature.SendFoldersOrFiles;

/// <summary>
/// Команда для отправление папок или файлов на другой сервер через SFTP
/// </summary>
public class SendFoldersOrFilesCommand: IRequest<SendFoldersOrFilesResponse>
{
    /// <summary>
    /// Список файлов или папок для отправки.
    /// </summary>
    public required List<SftpFileItem> FoldersOrFilesToSendList { get; set; }
    
    /// <summary>
    /// Идентификатор сервера, с которого будет отправлены файлы и папки.
    /// </summary>
    public required long SourceServerId { get; set; }
    
    /// <summary>
    /// Идентификатор сервера, на которого буут отправлены файли или папки
    /// </summary>
    public required long TargetServerId { get; set; }
    
    /// <summary>
    /// Id подключения WebSocket
    /// </summary>
    public required string ConnectionId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, инициирующего отправку.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
    
    /// <summary>
    /// Путь к директории 
    /// </summary>
    public required string RemotePath { get; set; }
}