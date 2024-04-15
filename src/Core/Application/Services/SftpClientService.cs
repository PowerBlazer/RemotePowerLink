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
    
    public SftpClient? GetClient(string connectionKey)
    {
        if (_sftpClients.TryGetValue(connectionKey, out var sftpClientInstance) &&
            sftpClientInstance.SftpClient.IsConnected)
        {
            return sftpClientInstance.SftpClient;
        }

        return null;
    }

    public SftpClient CreateClient(ConnectionServerParameter connectionServerParameter, string connectionKey)
    {
        var sftpClient = _sftpClients.GetOrAdd(connectionKey, _ => new SftpClientInstance
        {
            SftpClient = CreateNewClientInstance(connectionServerParameter),
            LastUsed = DateTime.Now
        }).SftpClient;

        if (sftpClient.IsConnected) 
            return sftpClient;
        
        DisconnectClient(connectionKey);
            
        var newSftpClient = _sftpClients.GetOrAdd(connectionKey, _ => new SftpClientInstance
        {
            SftpClient = CreateNewClientInstance(connectionServerParameter),
            LastUsed = DateTime.Now
        }).SftpClient;

        return newSftpClient;
    }

    public bool CheckExistingConnection(string connectionKey)
    {
        return _sftpClients.TryGetValue(connectionKey, out var sftpClientInstance) &&
               sftpClientInstance.SftpClient.IsConnected;
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
        var currentTime = DateTime.Now;
        foreach (var sftpClient in _sftpClients)
        {
            var clientInfo = sftpClient.Value;
            if ((currentTime - clientInfo.LastUsed).TotalMinutes >= IdleTimeoutMinutes)
            {
                DisconnectClient(sftpClient.Key);
            }
        }
    }
    
    private static SftpClient CreateNewClientInstance(ConnectionServerParameter connectionServerParameter)
    {
        var connectionInfo = ServerService.GetConnectionInfo(
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
    
    public class SftpClientInstance
    {
        public required SftpClient SftpClient { get; set; }
        public DateTime LastUsed { get; set; }
        
    }

}