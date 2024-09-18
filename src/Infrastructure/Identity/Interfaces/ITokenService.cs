using System.Security.Claims;
using Identity.Entities;

namespace Identity.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(IdentityUser identityUser);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string accessToken);
    Task<string> GenerateRefreshToken(long userId,string ipAddress,string? deviceName);
    Task<string> UpdateRefreshToken(long userId, string ipAddress);
    
}