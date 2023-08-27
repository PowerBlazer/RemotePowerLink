using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.ResendConfirmationCode;

[UsedImplicitly]
public class ResendConfirmationCodeCommand: IRequest<string>
{
    public ResendConfirmationCodeCommand(string sessionId, string email)
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