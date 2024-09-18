using MediatR;

namespace Application.Features.AuthorizationFeature.VerifyEmail;

public class VerifyEmailCommand: IRequest
{
    public VerifyEmailCommand(string sessionId, string verificationCode)
    {
        SessionId = sessionId;
        VerificationCode = verificationCode;
    }

    public string SessionId { get; }
    public string VerificationCode { get; }
}