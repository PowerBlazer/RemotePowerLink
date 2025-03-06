using Domain.DTOs.Connection;
using Renci.SshNet;

namespace Application.Services.Abstract;

public interface IConnectionService
{
    ConnectionInfo GetConnectionConfiguration(ConnectionServer connectionServer);
}