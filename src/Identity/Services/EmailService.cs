using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;
using Application.Layers.Identity.Services;
using Identity.Interfaces;

namespace Identity.Services;

[SuppressMessage("GeneratedRegex", "SYSLIB1045:Преобразовать в \"GeneratedRegexAttribute\".")]
public class EmailService: IEmailService
{
    private readonly IIdentityUserRepository _identityUserRepository;

    public EmailService(IIdentityUserRepository identityUserRepository)
    {
        _identityUserRepository = identityUserRepository;
    }

    public async Task<bool> ContainEmailAsync(string email)
    {
        var user = await _identityUserRepository.GetUserByEmailAsync(email);

        return user is not null;
    }

    public bool ValidationEmail(string email)
    {
        var regex = 
            new Regex(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$");
        
        return regex.IsMatch(email);
    }
}