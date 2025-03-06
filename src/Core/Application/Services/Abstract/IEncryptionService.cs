namespace Application.Services.Abstract;

public interface IEncryptionService
{
    string Encrypt(string value);
    string Decrypt(string value);

}