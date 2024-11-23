using System.Text.Json.Serialization;
using Domain.DTOs.Terminal;
using Domain.Entities;
using MediatR;

namespace Application.Features.TerminalSettingFeature.UpdateTerminalSetting;

/// <summary>
/// Команда для обновления настроек терминала пользователя
/// </summary>
public class UpdateTerminalSettingCommand: IRequest<TerminalSettingResponse>
{
    /// <summary>
    /// Размер шрифта терминала
    /// </summary>
    public int FontSize { get; set; }
    
    /// <summary>
    /// Идентификатор выбранной темы для терминала
    /// </summary>
    public long TerminalThemeId { get; set; }
    
    /// <summary>
    /// Идентификатор пользователя, которому принадлежит сервер.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }

    public static TerminalSetting MapToTerminalSetting(UpdateTerminalSettingCommand terminalSetting, long terminalSettingId)
    {
        return new TerminalSetting
        {
            Id = terminalSettingId,
            FontSize = terminalSetting.FontSize,
            TerminalThemeId = terminalSetting.TerminalThemeId,
            UserId = terminalSetting.UserId,
        };
    }
}