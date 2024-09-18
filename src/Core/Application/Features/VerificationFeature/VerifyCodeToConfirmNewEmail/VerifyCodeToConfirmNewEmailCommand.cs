using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToConfirmNewEmail;

public class VerifyCodeToConfirmNewEmailCommand: IRequest
{
    /// <summary>
    /// Идентификатор сессии
    /// </summary>
    public required string SessionId { get; set; }
    /// <summary>
    /// Код подтверждения
    /// </summary>
    public required string VerificationCode { get; set; }
}