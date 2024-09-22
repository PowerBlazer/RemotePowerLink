using Application.Layers.Identity.Models;

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
    /// Обновление почтового ящика пользователя
    /// </summary>
    /// <param name="updateEmailInput"></param>
    /// <returns></returns>
    Task UpdateEmail(UpdateEmailInput updateEmailInput);
}