using System.Text.Json.Serialization;
using Domain.DTOs.Sftp;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Features.SftpFeature.UploadFiles;

public class UploadFilesCommand: IRequest<UploadFilesResponse>
{
    /// <summary>
    /// Спсиок файлов для загрузки
    /// </summary>
    public required IList<IFormFile> UploadFiles { get; set; }
    
    /// <summary>
    /// Путь к директории для загрузки
    /// </summary>
    public required string UploadPath { get; set; }
    
    /// <summary>
    /// Идентификатор сервера, на котором будет загружены файлы.
    /// </summary>
    public required long ServerId { get; set; }
    
    /// <summary>
    /// Id подключения
    /// </summary>
    public required string ConnectionId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, инициирующего загружение файлов.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }
}