using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.SftpFeature.RenameFolderOrFile;


/// <summary>
/// Команда для переименовании файла или директории на удаленном сервере.
/// </summary>
public class RenameFolderOrFileCommand: IRequest
{
    /// <summary>
    /// Путь к файлу или директорию для переименования.
    /// </summary>
    public required string FileItemPath { get; set; }

    /// <summary>
    /// Новое название файла или директория.
    /// </summary>
    public required string FileItemNewName { get; set; }

    /// <summary>
    /// Идентификатор сервера, на котором будет переименована файл или директорие.
    /// </summary>
    public required long ServerId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, инициирующего переименования файла или директорие. Это свойство игнорируется при сериализации в JSON.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}