using Domain.Repository;
using MediatR;

namespace Application.Features.ServerFeature.DeleteServer;

public class DeleteServerHandler: IRequestHandler<DeleteServerCommand>
{
    private readonly IServerRepository _serverRepository;

    public DeleteServerHandler(IServerRepository serverRepository)
    {
        _serverRepository = serverRepository;
    }

    public Task Handle(DeleteServerCommand request, CancellationToken cancellationToken)
    {
        return _serverRepository.DeleteServerAsync(request.ServerId);
    }
}