using Domain.DTOs.User;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.GetUserData;

[UsedImplicitly]
public class GetUserDataHandler: IRequestHandler<GetUserDataCommand, GetUserDataResponse>
{
    private readonly IUserRepository _userRepository;

    public GetUserDataHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<GetUserDataResponse> Handle(GetUserDataCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserAsync(request.UserId);

        return GetUserDataResponse.MapUserTo(user);
    }
}