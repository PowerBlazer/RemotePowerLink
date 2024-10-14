using System.Text;
using Domain.DTOs.Connection;
using Renci.SshNet;

namespace Application.Helpers;

public class ConnectionMapper
{
    public static ConnectionInfo GetConnectionInfo(ConnectionServer connectionServer)
    {
        var connectionInfo = new ConnectionInfo(
            connectionServer.Hostname,
            connectionServer.SshPort ?? 22,
            connectionServer.Username,
            new PasswordAuthenticationMethod(connectionServer.Username, connectionServer.Password));

        var proxyParameter = connectionServer.ConnectionProxy;

        if (proxyParameter is not null)
        {
            connectionInfo = new ConnectionInfo(
                connectionServer.Hostname,
                connectionServer.SshPort ?? 22,
                connectionServer.Username,
                ProxyTypes.Http,
                proxyParameter.Hostname,
                proxyParameter.SshPort ?? 22,
                proxyParameter.Username,
                proxyParameter.Password,
                new PasswordAuthenticationMethod(connectionServer.Username, connectionServer.Password));
        }
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        
        connectionInfo.Encoding = Encoding.GetEncoding(connectionServer.EncodingCodePage);
        
        return connectionInfo;
    }
}