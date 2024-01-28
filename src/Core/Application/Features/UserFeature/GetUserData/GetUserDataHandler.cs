using Application.Layers.Persistence.Repositories;
using Domain.DTOs.User;
using MediatR;

namespace Application.Features.UserFeature.GetUserData;

public class GetUserDataHandler: IRequestHandler<GetUserDataCommand, UserDataResponse>
{
    private readonly IUserRepository _userRepository;

    public GetUserDataHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDataResponse> Handle(GetUserDataCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserAsync(request.UserId);

        return new UserDataResponse
        {
            UserId = user.UserId,
            UserName = user.Username
        };
    }
}