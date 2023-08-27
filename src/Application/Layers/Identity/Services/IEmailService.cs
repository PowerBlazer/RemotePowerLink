namespace Application.Layers.Identity.Services;

public interface IEmailService
{
    /// <summary>
    /// Узнать есть ли такая почта в системе
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    Task<bool> ContainEmailAsync(string email);
    /// <summary>
    /// Проверить почту на валидность 
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    bool ValidationEmail(string email);
}