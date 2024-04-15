using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.SftpFeature.CreateDirectory;

/// <summary>
/// Команда для создания новой директории на удаленном сервере.
/// </summary>
public class CreateDirectoryCommand : IRequest
{
    /// <summary>
    /// Путь к родительской директории, в которой будет создана новая директория.
    /// </summary>
    public required string DirectoryPath { get; set; }

    /// <summary>
    /// Имя новой директории.
    /// </summary>
    public required string DirectoryName { get; set; }

    /// <summary>
    /// Идентификатор сервера, на котором будет создана новая директория.
    /// </summary>
    public required long ServerId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, инициирующего создание директории. Это свойство игнорируется при сериализации в JSON.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}
