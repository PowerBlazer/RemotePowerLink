namespace Application.Layers.Email.Services;

public interface ISmtpEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string message);
}