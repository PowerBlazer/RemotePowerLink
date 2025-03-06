using System.Security.Cryptography;
using System.Text;
using Application.Services.Abstract;
using Microsoft.Extensions.Configuration;

namespace Application.Services.Logic;

public class EncryptionService: IEncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration configuration)
    {
        var key = configuration["Encryption:Key"] ?? throw new ArgumentNullException(nameof(configuration));
        
        _key = SHA256.HashData(Encoding.UTF8.GetBytes(key));
    }
    
    
    public string Encrypt(string value)
    {
        using var aes = Aes.Create();
        
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream();
        
        ms.Write(aes.IV, 0, aes.IV.Length); 
        
        using (var cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var writer = new StreamWriter(cryptoStream))
        {
            writer.Write(value);
        }
        
        return Convert.ToBase64String(ms.ToArray());
    }

    public string Decrypt(string value)
    {
        var buffer = Convert.FromBase64String(value);
        using var aes = Aes.Create();
        
        aes.Key = _key;
        
        var iv = new byte[aes.BlockSize / 8];
        Array.Copy(buffer, 0, iv, 0, iv.Length);
        
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream(buffer, iv.Length, buffer.Length - iv.Length);
        using var cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using var reader = new StreamReader(cryptoStream);
        
        return reader.ReadToEnd();
    }
}