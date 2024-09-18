using MediatR;

namespace Application.Features.VerificationFeature.ResendCodeToConfirmNewEmail;

public class ResendCodeToConfirmNewEmailCommand: IRequest<string>
{
    /// <summary>
    /// Новый почтовый ящик пользователя
    /// </summary>
    public required string NewEmail { get; set; }
    
    /// <summary>
    /// Идентификатор сессии
    /// </summary>
    public required string SessionId { get; set; }
}