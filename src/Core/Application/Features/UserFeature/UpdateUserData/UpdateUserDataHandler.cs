using Application.Layers.Identity;
using Domain.DTOs.User;
using Domain.Repository;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.UserFeature.UpdateUserData;

[UsedImplicitly]
public class UpdateUserDataHandler: IRequestHandler<UpdateUserDataCommand, UserData>
{
    private readonly IUserService _userService;
    private readonly IUserRepository _userRepository;

    public UpdateUserDataHandler(IUserService userService, IUserRepository userRepository)
    {
        _userService = userService;
        _userRepository = userRepository;
    }

    public async Task<UserData> Handle(UpdateUserDataCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await _userRepository.GetUser(request.UserId);
        currentUser.Username = request.Username;
        
        var identityUpdatedUser = UpdateUserDataCommand.MapToUpdateUserData(request);
        
        var updatedUser = await _userRepository.UpdateUser(currentUser);
        var updatedIdentityUser = await _userService.UpdateUserData(identityUpdatedUser);

        var userDataResponse = UserData.MapUserTo(updatedUser);
        
        userDataResponse.Email = updatedIdentityUser.Email;
        userDataResponse.DateCreated = updatedIdentityUser.DateCreated;
        userDataResponse.EmailConfirmed = updatedIdentityUser.EmailConfirmed;
        userDataResponse.PhoneNumber = updatedIdentityUser.PhoneNumber;
        userDataResponse.TwoFactorEnabled = updatedIdentityUser.TwoFactorEnabled;

        return userDataResponse;
    }
}