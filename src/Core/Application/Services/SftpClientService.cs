using System.Collections.Concurrent;
using Domain.Exceptions;
using Domain.Services;
using Domain.Services.Parameters;
using Renci.SshNet;

namespace Application.Services;

public class SftpClientService: ISftpClientService
{
    private readonly ConcurrentDictionary<string, SftpClient> _sftpClients = new();
    private readonly object _lock = new();

    
    public SftpClient GetClient(ConnectionServerParameter connectionServerParameter)
    {
        var connectionKey = $"{connectionServerParameter.Hostname} ${connectionServerParameter.Hostname}";
        
        return _sftpClients.GetOrAdd(connectionKey, _ => CreateNewClient(connectionServerParameter));
    }

    public void DisconnectClient(ConnectionServerParameter connectionServerParameter)
    {
        var connectionKey = $"{connectionServerParameter.Hostname} " +
                            $"${connectionServerParameter.Hostname}" +
                            $"${connectionServerParameter.Password}";
        
        if (_sftpClients.TryGetValue(connectionKey, out var sftpClient))
        {
            lock (_lock)
            {
                if (sftpClient.IsConnected)
                    sftpClient.Disconnect();
            }
            
            _sftpClients.TryRemove(connectionKey, out _);
        }
    }
    
    private static SftpClient CreateNewClient(ConnectionServerParameter connectionServerParameter)
    {
        var connectionInfo = GetConnectionInfo(
            connectionServerParameter.Hostname,
            connectionServerParameter.SshPort ?? 22,
            connectionServerParameter.Username,
            connectionServerParameter.Password,
            ProxyTypes.Http,
            connectionServerParameter.Proxy);
        
        var sftpClient = new SftpClient(connectionInfo);
        
        sftpClient.Connect();

        if (!sftpClient.IsConnected)
        {
            throw new ConnectionServerException(
                "Ошибка подключение к серверу, проверьте правильность введенных данных",
                "Connection");
        }
        
        return sftpClient;
    }
    
    private static ConnectionInfo GetConnectionInfo(string hostName,
        int port,
        string userName,
        string password,
        ProxyTypes proxyType,
        ProxyParameter? proxyParameter)
    {
        var connectionInfo = new ConnectionInfo(
            hostName,
            port,
            userName,
            new PasswordAuthenticationMethod(userName, password));

        if (proxyParameter is not null)
        {
            connectionInfo = new ConnectionInfo(
                hostName,
                port,
                userName,
                proxyType,
                proxyParameter.Hostname,
                proxyParameter.SshPort ?? 22,
                proxyParameter.Username,
                proxyParameter.Password,
                new PasswordAuthenticationMethod(userName, password));
        }

        return connectionInfo;
    }

}