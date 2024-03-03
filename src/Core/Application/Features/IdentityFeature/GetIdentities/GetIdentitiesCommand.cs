using Domain.DTOs.Identity;
using MediatR;

namespace Application.Features.IdentityFeature.GetIdentities;

/// <summary>
/// Команда для получения списка идентификаторов.
/// </summary>
public class GetIdentitiesCommand: IRequest<IEnumerable<GetIdentityResponse>>
{
    public GetIdentitiesCommand(long userId)
    {
        UserId = userId;
    }
    
    /// <summary>
    /// Id пользователя 
    /// </summary>
    public long UserId { get; }
}
