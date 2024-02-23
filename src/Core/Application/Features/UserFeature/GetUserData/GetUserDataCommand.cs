using Domain.DTOs.User;
using MediatR;

namespace Application.Features.UserFeature.GetUserData;

public record GetUserDataCommand(long UserId) : IRequest<GetUserDataResponse>;