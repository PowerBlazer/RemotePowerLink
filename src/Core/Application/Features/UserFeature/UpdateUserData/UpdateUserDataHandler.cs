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

        //Маппинг запроса для обновления IdentityUser
        var identityUpdatedUser = UpdateUserDataCommand.MapToUpdateUserData(request);
        
        //Проставление данных для обновления User
        UpdateUserDataCommand.SetUdpateDataToUser(request, ref currentUser);
        
        //Обновление данных User
        var updatedUser = await _userRepository.UpdateUser(currentUser);
        //Обновление данных IdentityUser
        var updatedIdentityUser = await _userService.UpdateUserData(identityUpdatedUser);
        
        //Маппинг результат обновленя
        var userDataResponse = UserData.MapUserTo(updatedUser);
        // Проставление обновленных данных IdentityUser
        Layers.Identity.Models.UserData.SetIdentityDataToUserData(updatedIdentityUser, ref userDataResponse);

        return userDataResponse;
    }
}