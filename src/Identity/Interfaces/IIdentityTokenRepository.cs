using Identity.Entities;

namespace Identity.Interfaces;

public interface IIdentityTokenRepository
{
    Task<IdentityToken> AddTokenAsync(IdentityToken token);
    Task<IdentityToken?> GetTokenByRefreshAsync(string refreshToken);
    Task<IdentityToken> UpdateTokenAsync(IdentityToken newToken);
    Task<IdentityToken?> GetTokenByUserAndIpAddress(long userId,string ipAddress);
}