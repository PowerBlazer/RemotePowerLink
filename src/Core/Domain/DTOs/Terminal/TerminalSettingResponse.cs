using Domain.Entities;

namespace Domain.DTOs.Terminal;

public class TerminalSettingResponse
{
    public int FontSize { get; set; }
    public long TerminalThemeId { get; set; }

    public static TerminalSettingResponse MapTo(TerminalSetting terminalSetting)
    {
        return new TerminalSettingResponse
        {
            FontSize = terminalSetting.FontSize,
            TerminalThemeId = terminalSetting.TerminalThemeId
        };
    }
}