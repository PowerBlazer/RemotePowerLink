using Domain.DTOs.Encoding;
using MediatR;

namespace Application.Features.EncodingFeature.GetEncodings;

/// <summary>
/// Команда для получения списка кодировок.
/// </summary>
public class GetEncodingsCommand: IRequest<IEnumerable<GetEncodingResponse>>
{
    
}