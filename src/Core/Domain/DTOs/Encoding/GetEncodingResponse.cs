namespace Domain.DTOs.Encoding;

/// <summary>
/// Ответ на запрос получения информации о кодировке.
/// </summary>
public class GetEncodingResponse
{
    /// <summary>
    /// Идентификатор кодировки
    /// </summary>
    public long EncodingId { get; set; }
    
    /// <summary>
    /// Название кодировки.
    /// </summary>
    public required string Name { get; set; }
    
    
    public static GetEncodingResponse EncodingMapTo(Entities.Encoding encoding)
    {
        return new GetEncodingResponse
        {
            Name = encoding.Name,
            EncodingId = encoding.Id
        };
    }
}