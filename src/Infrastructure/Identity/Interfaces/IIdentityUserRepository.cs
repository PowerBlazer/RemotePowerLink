using Identity.Entities;
using Identity.Models;

namespace Identity.Interfaces;

public interface IIdentityUserRepository
{
    Task<IdentityUser> AddUser(IdentityUser identityUser);
    Task<IdentityUser?> GetUserByEmail(string email);
    Task<IdentityUser> GetUserById(long userId);
    Task<IdentityUser> UpdateUser(IdentityUser identityUser);
    Task<IdentityUser> UpdateUserData(UpdateIdentityUserInput identityUser);
}