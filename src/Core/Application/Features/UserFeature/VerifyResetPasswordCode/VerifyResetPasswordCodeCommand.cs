using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.VerifyResetPasswordCode;

/// <summary>
/// Команда для подтверждения операции сброса пароля с помощью кода верификации
/// </summary>
[UsedImplicitly]
public class VerifyResetPasswordCodeCommand: IRequest
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