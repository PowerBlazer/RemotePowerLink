
using Domain.Entities;

namespace Domain.Services.Parameters;

public class ConnectionServerParameter
{
    public required string Hostname { get; set; }
    public int? SshPort { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public ProxyParameter? Proxy { get; set; }

    public static ConnectionServerParameter ServerMapTo(Server server)
    {
        var serverParameter = new ConnectionServerParameter
        {
            Hostname = server.IpAddress,
            SshPort = server.SshPort,
            Username = server.Identity!.Username,
            Password = server.Identity!.Password
        };

        if (server.Proxy is not null)
        {
            serverParameter.Proxy = new ProxyParameter
            {
                Hostname = server.Proxy.IpAddress,
                Username = server.Proxy.Identity!.Username,
                Password = server.Proxy.Identity!.Password,
                SshPort = server.Proxy.SshPort
            };
        }

        return serverParameter;
    }
}