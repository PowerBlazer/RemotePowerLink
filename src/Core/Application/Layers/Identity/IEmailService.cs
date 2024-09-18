namespace Application.Layers.Identity;

public interface IEmailService
{
    /// <summary>
    /// Проверяет, существует ли указанный адрес электронной почты в системе.
    /// </summary>
    /// <param name="email">Адрес электронной почты.</param>
    /// <returns>Значение true, если адрес электронной почты существует в системе, в противном случае — false.</returns>
    Task<bool> ContainEmail(string email);

    /// <summary>
    /// Проверяет валидность указанного адреса электронной почты.
    /// </summary>
    /// <param name="email">Адрес электронной почты для проверки.</param>
    /// <returns>Значение true, если адрес электронной почты является валидным, в противном случае — false.</returns>
    bool ValidationEmail(string email);
    
     /// <summary>
    /// Отправляет код, для сброса пароля пользователя
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>ID созданной сессии</returns>
    Task<string> SendCodeResetPassword(long userId);

    /// <summary>
    /// Подтверждает операцию сброса пароля с помощью кода верификации
    /// </summary>
    /// <param name="sessionId">Идентификатор сессии</param>
    /// <param name="verifyCode">Код подтверждения</param>
    /// <returns></returns>
    Task VerifyResetPasswordCode(string sessionId, string verifyCode);

    /// <summary>
    /// Повторно отправляет код, для сброса пароля пользователя
    /// </summary>
    /// <param name="sessionId">Идентификатор сессии</param>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>Id обновленной сессии</returns>
    Task<string> ResendResetPasswordCode(string sessionId, long userId);

    /// <summary>
    /// Отправляет код подтверждения для изменения почты пользователя
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>Id созданной сессии</returns>
    Task<string> SendCodeToChangeEmail(long userId);
    
    /// <summary>
    /// Повторно отправляет код потверждения для изменения почты
    /// </summary>
    /// <param name="sessionId">Id текущей сессии</param>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>Id обновленной сессии</returns>
    Task<string> ResendCodeToChangeEmail(string sessionId, long userId);
    
    /// <summary>
    /// Потдверждение изменения почты пользователя
    /// </summary>
    /// <param name="sessionId">Id текущей сессии</param>
    /// <param name="verifyCode">Код потдверждения</param>
    /// <returns></returns>
    Task VerifyCodeToChangeEmail(string sessionId, string verifyCode);
    
    /// <summary>
    /// Отправляет код подтверждения для подтверждение нового электронного адреса
    /// </summary>
    /// <param name="newEmail">Новая почта</param>
    /// <returns>Id созданной сессии</returns>
    Task<string> SendCodeToConfirmNewEmail(string newEmail);
    
    /// <summary>
    /// Повторно отправляет код потверждения для подтверждение нового электронного адреса
    /// </summary>
    /// <param name="sessionId">Id текущей сессии</param>
    /// <param name="newEmail">Новый почтовый ящик пользователя</param>
    /// <returns>Id обновленной сессии</returns>
    Task<string> ResendCodeToConfirmNewEmail(string sessionId, string newEmail);
    
    /// <summary>
    /// Подтверждение нового электронного адреса
    /// </summary>
    /// <param name="sessionId">Id текущей сессии</param>
    /// <param name="verifyCode">Код потдверждения</param>
    /// <returns></returns>
    Task VerifyCodeToConfirmNewEmail(string sessionId, string verifyCode);
}