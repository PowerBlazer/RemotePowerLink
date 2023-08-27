using MediatR;

namespace Application.Features.AuthorizationFeature.VerifyEmailCode;

public class VerifyEmailCodeCommand: IRequest
{
    public VerifyEmailCodeCommand(string sessionId, string verificationCode)
    {
        SessionId = sessionId;
        VerificationCode = verificationCode;
    }

    public string SessionId { get; }
    public string VerificationCode { get; }
}