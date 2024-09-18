using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToChangeEmail;

public class VerifyCodeToChangeEmailCommand: IRequest
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