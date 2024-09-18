namespace Application.Layers.Email;

/// <summary>
/// Определяет методы для отправки электронной почты через SMTP-сервер.
/// </summary>
public interface ISmtpEmailService
{
    /// <summary>
    /// Отправляет электронное письмо асинхронно.
    /// </summary>
    /// <param name="toEmail">Адрес электронной почты получателя.</param>
    /// <param name="subject">Тема письма.</param>
    /// <param name="message">Сообщение письма.</param>
    Task SendEmail(string toEmail, string subject, string message);
}
