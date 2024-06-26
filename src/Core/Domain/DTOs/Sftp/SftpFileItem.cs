﻿using Domain.Enums;

namespace Domain.DTOs.Sftp;

public class SftpFileItem
{
    /// <summary>
    /// Название файла каталога
    /// </summary>
    public required string Name { get; set; }
    
    /// <summary>
    /// Дата изменения файла
    /// </summary>
    public DateTime? DateModified { get; set; }
    
    /// <summary>
    /// Размер файла
    /// </summary>
    public long? Size { get; set; }
    
    /// <summary>
    /// Тип файла каталога
    /// </summary>
    public required FileTypeEnum FileType { get; set; }
    
    /// <summary>
    /// Название типа файла каталога
    /// </summary>
    public string? FileTypeName { get; set; }
    
    /// <summary>
    /// Путь к файлу
    /// </summary>
    public required string Path { get; set; }
}