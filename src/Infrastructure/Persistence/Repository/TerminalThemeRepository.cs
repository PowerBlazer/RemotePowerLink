using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class TerminalThemeRepository: ITerminalThemeRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public TerminalThemeRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<IEnumerable<TerminalTheme>> GetTerminalThemes()
    {
        var terminalThemes = await _persistenceContext.TerminalThemes.ToListAsync();

        return terminalThemes;
    }
}