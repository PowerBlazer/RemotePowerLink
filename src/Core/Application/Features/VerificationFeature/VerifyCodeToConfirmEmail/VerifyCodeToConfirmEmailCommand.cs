using MediatR;

namespace Application.Features.VerificationFeature.VerifyCodeToConfirmEmail;

public class VerifyCodeToConfirmEmailCommand: IRequest
{
    public VerifyCodeToConfirmEmailCommand(string sessionId, string verificationCode)
    {
        SessionId = sessionId;
        VerificationCode = verificationCode;
    }

    public string SessionId { get; }
    public string VerificationCode { get; }
}