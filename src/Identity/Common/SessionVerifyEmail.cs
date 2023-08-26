using System.Text.Json;

namespace Identity.Common;

public class SessionVerifyEmail
{
    public string? VerificationCode { get; set; }
    public string? Email { get; set; }
    public bool IsOk { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}