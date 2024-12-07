using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class TerminalSetting : BaseEntity<long>
{
    /// <summary>
    /// Размер шрифта терминала.
    /// Обязательное поле.
    /// </summary>
    public int FontSize { get; set; }
    

    #region Relationship

    /// <summary>
    /// Идентификатор темы терминала.
    /// Обязательное поле, связывает настройки с конкретной темой.
    /// </summary>
    public long TerminalThemeId { get; set; }

    /// <summary>
    /// Тема терминала, связанная с настройками.
    /// Может быть <c>null</c>, если тема не задана.
    /// </summary>
    public TerminalTheme? TerminalTheme { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, связанного с настройками терминала.
    /// Обязательное поле.
    /// </summary>
    public long UserId { get; set; }

    /// <summary>
    /// Пользователь, связанный с настройками терминала.
    /// Может быть <c>null</c>, если пользователь не задан.
    /// </summary>
    public User? User { get; set; }

    #endregion
}
