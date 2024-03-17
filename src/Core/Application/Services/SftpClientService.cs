using System.Collections.Concurrent;
using Domain.Exceptions;
using Domain.Services;
using Domain.Services.Parameters;
using Renci.SshNet;

namespace Application.Services;

public class SftpClientService: ISftpClientService
{
    private readonly ConcurrentDictionary<string, SftpClientInstance> _sftpClients = new();
    private readonly object _lock = new();
    private const int IdleTimeoutMinutes = 10;
    
    public SftpClient GetClient(ConnectionServerParameter connectionServerParameter)
    {
        var connectionKey = $"{connectionServerParameter.Hostname} " +
                            $"${connectionServerParameter.Hostname}" +
                            $"${connectionServerParameter.Password}";
        
        return _sftpClients.GetOrAdd(connectionKey, _ => new SftpClientInstance
        {
            SftpClient = CreateNewClient(connectionServerParameter),
            LastUsed = DateTime.Now
        }).SftpClient;
    }

    public void DisconnectClient(string connectionKey)
    {
        if (!_sftpClients.TryGetValue(connectionKey, out var sftpClientInstance)) 
            return;
        
        lock (_lock)
        {
            if (sftpClientInstance.SftpClient.IsConnected)
            {
                sftpClientInstance.SftpClient.Disconnect();
            }
        }
            
        _sftpClients.TryRemove(connectionKey, out _);
    }
    
    public void DisconnectIdleClients()
    {
        var currentTime = DateTime.UtcNow;
        foreach (var sftpClient in _sftpClients)
        {
            var clientInfo = sftpClient.Value;
            if ((currentTime - clientInfo.LastUsed).TotalMinutes >= IdleTimeoutMinutes)
            {
                DisconnectClient(sftpClient.Key);
            }
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
        
        try
        {
            sftpClient.Connect();
        }
        catch (Exception)
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
    
    public class SftpClientInstance
    {
        public required SftpClient SftpClient { get; set; }
        public DateTime LastUsed { get; set; }
        
    }

}