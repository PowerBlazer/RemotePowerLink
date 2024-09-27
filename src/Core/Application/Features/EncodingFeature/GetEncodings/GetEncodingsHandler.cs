using Application.Layers.Persistence.Repository;
using Domain.DTOs.Encoding;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.EncodingFeature.GetEncodings;

[UsedImplicitly]
public class GetEncodingsHandler: IRequestHandler<GetEncodingsCommand, IEnumerable<GetEncodingResponse>>
{
    private readonly IEncodingRepository _encodingRepository;

    public GetEncodingsHandler(IEncodingRepository encodingRepository)
    {
        _encodingRepository = encodingRepository;
    }

    public async Task<IEnumerable<GetEncodingResponse>> Handle(GetEncodingsCommand request, CancellationToken cancellationToken)
    {
        var encodings = await _encodingRepository.GetEncodings();

        return encodings.Select(GetEncodingResponse.EncodingMapTo);
    }
}