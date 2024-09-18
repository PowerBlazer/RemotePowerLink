using JetBrains.Annotations;
using MediatR;

namespace Application.Features.EmailFeature.VerifyCodeToResetPassword;

/// <summary>
/// Команда для подтверждения операции сброса пароля с помощью кода верификации
/// </summary>
[UsedImplicitly]
public class VerifyCodeToResetPasswordCommand: IRequest
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