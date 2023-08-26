namespace Domain.DTOs.Authorization;

public class LoginRequest
{
    public LoginRequest(string email, string password)
    {
        Email = email;
        Password = password;
    }
    
    /// <summary>
    /// Почта пользователя
    /// </summary>
    public string Email { get; }
    /// <summary>
    /// Пароль пользователя
    /// </summary>
    public string Password { get; }
}