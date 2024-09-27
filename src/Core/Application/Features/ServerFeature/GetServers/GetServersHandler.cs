using Application.Layers.Persistence.Repository;
using Domain.DTOs.Server;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.ServerFeature.GetServers;

[UsedImplicitly]
public class GetServersHandler: IRequestHandler<GetServersCommand,IEnumerable<GetServerResponse>>
{
    private readonly IServerRepository _serverRepository;
    public GetServersHandler(IServerRepository serverRepository)
    {
        _serverRepository = serverRepository;
    }
    
    public async Task<IEnumerable<GetServerResponse>> Handle(GetServersCommand request, CancellationToken cancellationToken)
    {
        var servers = await _serverRepository.GetServersInUser(request.UserId);
        
        var serverResponse = servers.Select(GetServerResponse.MapServerTo);

        return serverResponse;
    }
}