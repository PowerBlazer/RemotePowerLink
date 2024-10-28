using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class TerminalTheme: BaseEntity<long>
{
    /// <summary>
    /// Название темы
    /// </summary>
    public string? Name { get; set; }
    
    /// <summary>
    /// Цвет черного цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Black { get; set; } 

    /// <summary>
    /// Цвет красного цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Red { get; set; } 

    /// <summary>
    /// Цвет зеленого цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Green { get; set; } 

    /// <summary>
    /// Цвет желтого цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Yellow { get; set; } 

    /// <summary>
    /// Цвет синего цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Blue { get; set; } 

    /// <summary>
    /// Цвет пурпурного цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Purple { get; set; } 

    /// <summary>
    /// Цвет цианового цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Cyan { get; set; } 

    /// <summary>
    /// Цвет белого цвета (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? White { get; set; } 

    /// <summary>
    /// Яркий черный цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightBlack { get; set; } 

    /// <summary>
    /// Яркий красный цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightRed { get; set; } 

    /// <summary>
    /// Яркий зеленый цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightGreen { get; set; } 

    /// <summary>
    /// Яркий желтый цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightYellow { get; set; } 

    /// <summary>
    /// Яркий синий цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightBlue { get; set; } 

    /// <summary>
    /// Яркий пурпурный цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightPurple { get; set; } 

    /// <summary>
    /// Яркий циановый цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightCyan { get; set; } 

    /// <summary>
    /// Яркий белый цвет (ANSI).
    /// Может быть <c>null</c>.
    /// </summary>
    public string? BrightWhite { get; set; } 

    /// <summary>
    /// Цвет фона терминала.
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Background { get; set; } 

    /// <summary>
    /// Цвет текста в терминале.
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Foreground { get; set; } 

    /// <summary>
    /// Цвет курсора в терминале.
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Cursor { get; set; } 

    /// <summary>
    /// Цвет выделенного текста в терминале.
    /// Может быть <c>null</c>.
    /// </summary>
    public string? Selection { get; set; }

    #region Relationship

    public ICollection<TerminalSetting>? TerminalSettings { get; set; }

    #endregion
}