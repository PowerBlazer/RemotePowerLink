using Application.Layers.Persistence.Repository;
using Domain.DTOs.Terminal;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.TerminalSettingFeature.UpdateTerminalSetting;

[UsedImplicitly]
public class UpdateTerminalSettingHandler: IRequestHandler<UpdateTerminalSettingCommand, TerminalSettingResponse>
{
    private readonly ITerminalSettingRepository _terminalSettingRepository;

    public UpdateTerminalSettingHandler(ITerminalSettingRepository terminalSettingRepository)
    {
        _terminalSettingRepository = terminalSettingRepository;
    }

    public async Task<TerminalSettingResponse> Handle(UpdateTerminalSettingCommand request, CancellationToken cancellationToken)
    {
        var currentTerminalSetting = await _terminalSettingRepository.GetTerminalSettingByUser(request.UserId);
        
        var terminalSetting = UpdateTerminalSettingCommand.MapToTerminalSetting(request, currentTerminalSetting.Id);
        
        await _terminalSettingRepository.UpdateTerminalSetting(terminalSetting);

        return TerminalSettingResponse.MapTo(terminalSetting);
    }
}