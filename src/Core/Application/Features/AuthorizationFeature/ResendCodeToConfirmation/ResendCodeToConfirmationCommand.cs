using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.ResendCodeToConfirmation;

[UsedImplicitly]
public class ResendCodeToConfirmationCommand: IRequest<string>
{
    public ResendCodeToConfirmationCommand(string sessionId, string email)
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