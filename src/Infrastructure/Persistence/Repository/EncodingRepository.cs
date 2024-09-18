using Application.Layers.Persistence;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repository;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class EncodingRepository: IEncodingRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public EncodingRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<IEnumerable<Encoding>> GetEncodings() => 
        await _persistenceContext.Encodings.ToListAsync();
    
    

    public async Task<Encoding> GetEncoding(long encodingId)
    {
        var encoding = await _persistenceContext.Encodings
            .FirstOrDefaultAsync(p => p.Id == encodingId);

        if (encoding is null)
        {
            throw new NotFoundException("Кодировка с указанным 'EncodingId' не найден", "EncodingId");
        }

        return encoding;
    }
}