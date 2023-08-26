namespace Identity.Helpers;

public static class VerificationCode
{
    public static string GenerateVerificationCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}