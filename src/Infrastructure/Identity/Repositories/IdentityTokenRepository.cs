using Identity.Contexts;
using Identity.Entities;
using Identity.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Identity.Repositories;

public class IdentityTokenRepository: IIdentityTokenRepository
{
    private readonly IdentityContext _identityContext;

    public IdentityTokenRepository(IdentityContext identityContext)
    {
        _identityContext = identityContext;
    }

    public async Task<IdentityToken> AddTokenAsync(IdentityToken token)
    {
       var result = await _identityContext.IdentityTokens.AddAsync(token);

       await _identityContext.SaveChangesAsync();

       return result.Entity;
    }

    public async Task<IdentityToken?> GetTokenByRefreshAsync(string refreshToken)
    {
        return await _identityContext.IdentityTokens.FirstOrDefaultAsync(p => p.Token == refreshToken);
    }

    public async Task<IdentityToken> UpdateTokenAsync(IdentityToken updatedToken)
    {
        _identityContext.Attach(updatedToken);

        _identityContext.Entry(updatedToken).State = EntityState.Modified;

        await _identityContext.SaveChangesAsync();

        return updatedToken;
    }

    public async Task<IdentityToken?> GetTokenByUserAndIpAddress(long userId,string ipAddress)
    {
        return await _identityContext.IdentityTokens
            .FirstOrDefaultAsync(p => p.UserId == userId && p.IpAddress == ipAddress);
    }
}