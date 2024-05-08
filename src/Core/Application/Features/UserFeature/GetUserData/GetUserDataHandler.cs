using Application.Layers.Identity;
using Domain.DTOs.User;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.GetUserData;

[UsedImplicitly]
public class GetUserDataHandler: IRequestHandler<GetUserDataCommand, GetUserDataResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserService _userService;

    public GetUserDataHandler(IUserRepository userRepository, 
        IUserService userService)
    {
        _userRepository = userRepository;
        _userService = userService;
    }

    public async Task<GetUserDataResponse> Handle(GetUserDataCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserAsync(request.UserId);
        var identityUserData = await _userService.GetUserInformationAsync(request.UserId);
        
        var userDataResponse = GetUserDataResponse.MapUserTo(user);

        userDataResponse.Email = identityUserData.Email;
        userDataResponse.DateCreated = identityUserData.DateCreated;
        userDataResponse.EmailConfirmed = identityUserData.EmailConfirmed;
        userDataResponse.PhoneNumber = identityUserData.PhoneNumber;
        userDataResponse.TwoFactorEnabled = identityUserData.TwoFactorEnabled;

        return userDataResponse;
    }
}