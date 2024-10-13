using Application.Layers.Persistence.Repository;
using Domain.Exceptions;
using MediatR;

namespace Application.Features.ServerFeature.DeleteServer;

public class DeleteServerHandler: IRequestHandler<DeleteServerCommand>
{
    private readonly IServerRepository _serverRepository;

    public DeleteServerHandler(IServerRepository serverRepository)
    {
        _serverRepository = serverRepository;
    }

    public async Task Handle(DeleteServerCommand request, CancellationToken cancellationToken)
    {
        var server = await _serverRepository.GetServer(request.ServerId);

        if (server.UserId != request.UserId)
        {
            throw new NoAccessException(
                $"У пользователя с таким {request.UserId} UserId нет доступа к серверу с таким ${request.ServerId} ServerId",
                "Server");
        }
        
        await _serverRepository.DeleteServer(request.ServerId);
    }
}