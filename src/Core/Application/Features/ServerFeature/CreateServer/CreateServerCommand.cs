using Domain.DTOs.Server;
using MediatR;

namespace Application.Features.ServerFeature.CreateServer;

public class CreateServerCommand: IRequest<CreateServerResponse>
{
    public required string Hostname { get; set; }
    public required string Title { get; set; }
    public int? Port { get; set; }
    public string? StartupCommand { get; set; }
    public required long IdentityId { get; set; }
    public required long UserId { get; set; }
    public long? ProxyId { get; set; }
}