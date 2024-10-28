using Domain.DTOs.Terminal;
using MediatR;

namespace Application.Features.TerminalThemeFeature.GetTerminalThemes;

/// <summary>
/// Команда для получения списка тем для терминала
/// </summary>
public class GetTerminalThemesCommand: IRequest<IEnumerable<TerminalThemeResponse>>
{
    
}