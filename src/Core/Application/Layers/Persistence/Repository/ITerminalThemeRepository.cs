using Domain.Entities;

namespace Application.Layers.Persistence.Repository;

public interface ITerminalThemeRepository
{
    Task<IEnumerable<TerminalTheme>> GetTerminalThemes();
}