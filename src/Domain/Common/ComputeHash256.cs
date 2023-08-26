using System.Security.Cryptography;
using System.Text;

namespace Domain.Common;

public static class ComputeHash256
{
    public static string ComputeSha256Hash(string rawData)
    {
        using var sha256Hash = SHA256.Create();
        
        var bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
        
        var builder = new StringBuilder();
        
        foreach (var t in bytes)
        {
            builder.Append(t.ToString("x2"));
        }

        return builder.ToString();
    }
}

