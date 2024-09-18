using Application.Layers.Identity.Models.Authorization;

namespace Application.Layers.Identity;

public interface IAuthorizationService
{
    /// <summary>
    /// Отправляет код подтверждения на указанный адрес электронной почты пользователя.
    /// </summary>
    /// <param name="email">Адрес электронной почты пользователя.</param>
    /// <returns>ID созданной сессии.</returns>
    Task<string> SendCodeToEmailVerification(string email);

    /// <summary>
    /// Повторно отправляет код подтверждения на указанный адрес электронной почты пользователя.
    /// </summary>
    /// <param name="sessionId">ID сессии.</param>
    /// <param name="email">Адрес электронной почты пользователя.</param>
    /// <returns>ID пересозданной сессии.</returns>
    Task<string> ResendCodeToVerification(string sessionId, string email);

    /// <summary>
    /// Подтверждает адрес электронной почты пользователя с использованием кода подтверждения.
    /// </summary>
    /// <param name="sessionId">ID сессии.</param>
    /// <param name="verifyCode">Код подтверждения.</param>
    Task VerifyEmail(string sessionId, string verifyCode);

    /// <summary>
    /// Регистрирует нового пользователя на основе предоставленных данных регистрации.
    /// </summary>
    /// <param name="registrationRequest">Данные регистрации пользователя.</param>
    /// <returns>Результат регистрации.</returns>
    Task<RegistrationResponse> RegisterUser(RegistrationRequest registrationRequest);

    /// <summary>
    /// Аутентифицирует пользователя на основе предоставленных учетных данных.
    /// </summary>
    /// <param name="loginRequest">Данные для входа пользователя.</param>
    /// <returns>Результат аутентификации.</returns>
    Task<LoginResponse> LoginUser(LoginRequest loginRequest);

    /// <summary>
    /// Обновляет токены доступа и обновления на основе предоставленного запроса обновления токенов.
    /// </summary>
    /// <param name="refreshTokenRequest">Данные запроса обновления токенов.</param>
    /// <returns>Обновленные токены.</returns>
    Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest refreshTokenRequest);
    
    
}