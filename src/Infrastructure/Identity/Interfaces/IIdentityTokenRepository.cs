using Identity.Entities;

namespace Identity.Interfaces;

public interface IIdentityTokenRepository
{
    Task<IdentityToken> AddToken(IdentityToken token);
    Task<IdentityToken?> GetTokenByRefresh(string refreshToken);
    Task<IdentityToken> UpdateToken(IdentityToken newToken);
    Task<IdentityToken?> GetTokenByUserAndIpAddress(long userId,string ipAddress);
    Task DeleteTokensByUserId(long userId);
}