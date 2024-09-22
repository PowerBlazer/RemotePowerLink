namespace Application.Layers.Identity;

public interface IVerificationService
{
    /// <summary>
    /// Отправляет код подтверждения на указанный адрес электронной почты пользователя.
    /// </summary>
    /// <param name="email">Адрес электронной почты пользователя.</param>
    /// <returns>ID созданной сессии.</returns>
    Task<string> SendCodeToConfirmEmail(string email);

    /// <summary>
    /// Повторно отправляет код подтверждения на указанный адрес электронной почты пользователя.
    /// </summary>
    /// <param name="sessionId">ID сессии.</param>
    /// <param name="email">Адрес электронной почты пользователя.</param>
    /// <returns>ID пересозданной сессии.</returns>
    Task<string> ResendCodeToConfirmEmail(string sessionId, string email);

    /// <summary>
    /// Подтверждает адрес электронной почты пользователя с использованием кода подтверждения.
    /// </summary>
    /// <param name="sessionId">ID сессии.</param>
    /// <param name="verifyCode">Код подтверждения.</param>
    Task VerifyCodeToConfirmEmail(string sessionId, string verifyCode);
    
    /// <summary>
    /// Отправляет код, для сброса пароля пользователя
    /// </summary>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>ID созданной сессии</returns>
    Task<string> SendCodeToUpdatePassword(long userId);

    /// <summary>
    /// Подтверждает операцию сброса пароля с помощью кода верификации
    /// </summary>
    /// <param name="sessionId">Идентификатор сессии</param>
    /// <param name="verifyCode">Код подтверждения</param>
    /// <returns></returns>
    Task VerifyCodeToUpdatePassword(string sessionId, string verifyCode);

    /// <summary>
    /// Повторно отправляет код, для сброса пароля пользователя
    /// </summary>
    /// <param name="sessionId">Идентификатор сессии</param>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <returns>Id обновленной сессии</returns>
    Task<string> ResendCodeToUpdatePassword(string sessionId, long userId);

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
    Task<string> SendCodeToConfirmNewEmail(string newEmail, string sessionId);
    
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