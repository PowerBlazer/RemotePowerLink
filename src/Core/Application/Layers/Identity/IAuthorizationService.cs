using Application.Layers.Identity.Models.Authorization;

namespace Application.Layers.Identity;

public interface IAuthorizationService
{
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