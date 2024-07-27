using System.Text.Json;

namespace Identity.Common;

public class SessionResetPassword
{
    public string? VerificationCode { get; set; }
    public required long UserId { get; set; }
    public bool IsOk { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}