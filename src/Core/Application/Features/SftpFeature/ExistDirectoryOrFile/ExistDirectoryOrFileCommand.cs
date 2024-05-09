using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.SftpFeature.ExistDirectoryOrFile;

/// <summary>
/// Команда для проверки существования пути к директории или к файлу
/// </summary>
public class ExistDirectoryOrFileCommand: IRequest<bool>
{
    /// <summary>
    /// Путь к папке или к файлу.
    /// </summary>
    public required string FolderOrFilePath { get; set; }
    
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