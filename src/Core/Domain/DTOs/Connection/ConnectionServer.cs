
namespace Domain.DTOs.Connection;

public class ConnectionServer
{
    public required string Hostname { get; set; }
    public int? SshPort { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required int EncodingCodePage { get; set; }
    public ConnectionProxy? ConnectionProxy { get; set; }

    public static ConnectionServer ServerMapTo(Entities.Server server)
    {
        if (server.Identity is null)
        {
            throw new NullReferenceException("Невозможно смапиить параметер подключения без Identity в Server");
        }
        
        var serverParameter = new ConnectionServer
        {
            Hostname = server.IpAddress,
            SshPort = server.SshPort,
            Username = server.Identity.Username,
            Password = server.Identity.Password,
            EncodingCodePage = server.Encoding?.CodePage ?? 65001
        };

        if (server.Proxy is not null)
        {
            if (server.Proxy.Identity is null)
            {
                throw new NullReferenceException("Невозможно смапиить параметер подключения без Identity в Proxy");
            }
            
            serverParameter.ConnectionProxy = new ConnectionProxy
            {
                Hostname = server.Proxy.IpAddress,
                Username = server.Proxy.Identity.Username,
                Password = server.Proxy.Identity.Password,
                SshPort = server.Proxy.SshPort,
                EncodingCodePage = 65001
            };
        }

        return serverParameter;
    }
}