using Domain.DTOs.Terminal;
using MediatR;

namespace Application.Features.TerminalSettingFeature.GetTerminalSettingByUser;

/// <summary>
/// Команда длая получение настроек терминала по идентификатору пользователя
/// </summary>
public class GetTerminalSettingByUserCommand: IRequest<TerminalSettingResponse>
{
    public GetTerminalSettingByUserCommand(long userId)
    {
        UserId = userId;
    }

    /// <summary>
    /// Получает или устанавливает идентификатор пользователя.
    /// </summary>
    public long UserId { get; }
}