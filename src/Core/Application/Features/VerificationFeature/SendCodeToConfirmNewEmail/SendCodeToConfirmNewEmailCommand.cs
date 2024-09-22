using MediatR;

namespace Application.Features.VerificationFeature.SendCodeToConfirmNewEmail;

public class SendCodeToConfirmNewEmailCommand: IRequest<string>
{
    /// <summary>
    /// Новый почтовый ящик пользователя
    /// </summary>
    public required string NewEmail { get; set; }
    
    /// <summary>
    /// Id сессии подтвержденной текущей почты
    /// </summary>
    public required string SessionId { get; set; }
}