using JetBrains.Annotations;
using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToConfirmEmail;

[UsedImplicitly]
public class ResendCodeToConfirmEmailCommand: IRequest<string>
{
    public ResendCodeToConfirmEmailCommand(string sessionId, string email)
    {
        SessionId = sessionId;
        Email = email;
    }
    
    /// <summary>
    /// ID сессии 
    /// </summary>
    public string SessionId { get; }
    /// <summary>
    /// Почта пользователя
    /// </summary>
    public string Email { get; }
}