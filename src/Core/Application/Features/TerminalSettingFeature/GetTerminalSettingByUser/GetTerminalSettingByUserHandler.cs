using Application.Layers.Persistence.Repository;
using Domain.DTOs.Terminal;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.TerminalSettingFeature.GetTerminalSettingByUser;

[UsedImplicitly]
public class GetTerminalSettingByUserHandler: IRequestHandler<GetTerminalSettingByUserCommand, TerminalSettingResponse>
{
    private readonly ITerminalSettingRepository _terminalSettingRepository;

    public GetTerminalSettingByUserHandler(ITerminalSettingRepository terminalSettingRepository)
    {
        _terminalSettingRepository = terminalSettingRepository;
    }

    public async Task<TerminalSettingResponse> Handle(GetTerminalSettingByUserCommand request, CancellationToken cancellationToken)
    {
        var terminalSetting = await _terminalSettingRepository.GetTerminalSettingByUser(request.UserId);

        return TerminalSettingResponse.MapTo(terminalSetting);
    }
}