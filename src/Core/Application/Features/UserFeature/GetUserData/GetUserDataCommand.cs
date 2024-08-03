using Domain.DTOs.User;
using MediatR;

namespace Application.Features.UserFeature.GetUserData;

/// <summary>
/// Команда для получения данных пользователя.
/// </summary>
public class GetUserDataCommand : IRequest<UserData>
{
    public GetUserDataCommand(long userId)
    {
        UserId = userId;
    }
    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    public long UserId { get; }
}