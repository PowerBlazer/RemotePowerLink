using Application.Layers.Identity;
using Application.Layers.Persistence.Repository;
using Domain.DTOs.User;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.GetUserData;

[UsedImplicitly]
public class GetUserDataHandler: IRequestHandler<GetUserDataCommand, UserData>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserService _userService;

    public GetUserDataHandler(IUserRepository userRepository, 
        IUserService userService)
    {
        _userRepository = userRepository;
        _userService = userService;
    }

    public async Task<UserData> Handle(GetUserDataCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUser(request.UserId);
        var identityUserData = await _userService.GetUserData(request.UserId);
        
        var userDataResponse = UserData.MapUserTo(user);

        userDataResponse.Email = identityUserData.Email;
        userDataResponse.DateCreated = identityUserData.DateCreated;
        userDataResponse.EmailConfirmed = identityUserData.EmailConfirmed;
        userDataResponse.PhoneNumber = identityUserData.PhoneNumber;
        userDataResponse.TwoFactorEnabled = identityUserData.TwoFactorEnabled;

        return userDataResponse;
    }
}