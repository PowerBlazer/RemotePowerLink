using Domain.Entities;

namespace Application.Layers.Persistence.Repository;

public interface ITerminalSettingRepository
{
    Task<TerminalSetting> GetTerminalSettingByUser(long userId);
    Task<TerminalSetting> AddTerminalSetting(TerminalSetting terminalSetting);
}