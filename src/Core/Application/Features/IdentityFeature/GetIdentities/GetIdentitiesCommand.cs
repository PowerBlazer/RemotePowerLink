using Domain.DTOs.Identity;
using MediatR;

namespace Application.Features.IdentityFeature.GetIdentities;

public record GetIdentitiesCommand(long UserId) : IRequest<IEnumerable<GetIdentityResponse>>;