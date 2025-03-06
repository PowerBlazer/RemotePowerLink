using System.Text;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Renci.SshNet;

namespace Application.Services.Logic;

public class ConnectionService: IConnectionService
{
    private readonly IEncryptionService _encryptionService;

    public ConnectionService(IEncryptionService encryptionService)
    {
        _encryptionService = encryptionService;
    }

    public ConnectionInfo GetConnectionConfiguration(ConnectionServer connectionServer)
    {
        var decodedPassword = _encryptionService.Decrypt(connectionServer.Password);
        
        var connectionInfo = new ConnectionInfo(
            connectionServer.Hostname,
            connectionServer.SshPort ?? 22,
            connectionServer.Username,
            new PasswordAuthenticationMethod(connectionServer.Username, decodedPassword));

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
                new PasswordAuthenticationMethod(connectionServer.Username, decodedPassword));
        }
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        
        connectionInfo.Encoding = Encoding.GetEncoding(connectionServer.EncodingCodePage);
        
        return connectionInfo;
    }
}