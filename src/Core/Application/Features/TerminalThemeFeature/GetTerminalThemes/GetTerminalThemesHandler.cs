using Application.Layers.Persistence.Repository;
using Domain.DTOs.Terminal;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.TerminalThemeFeature.GetTerminalThemes;

[UsedImplicitly]
public class GetTerminalThemesHandler: IRequestHandler<GetTerminalThemesCommand, IEnumerable<TerminalThemeResponse>>
{
    private readonly ITerminalThemeRepository _terminalThemeRepository;

    public GetTerminalThemesHandler(ITerminalThemeRepository terminalThemeRepository)
    {
        _terminalThemeRepository = terminalThemeRepository;
    }

    public async Task<IEnumerable<TerminalThemeResponse>> Handle(GetTerminalThemesCommand request, CancellationToken cancellationToken)
    {
         var terminalThemes = await _terminalThemeRepository.GetTerminalThemes();

         return terminalThemes.Select(TerminalThemeResponse.MapTerminalThemeTo);
    }
}