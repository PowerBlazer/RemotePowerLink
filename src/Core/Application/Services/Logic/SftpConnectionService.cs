using System.Collections.Concurrent;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.Exceptions;
using Renci.SshNet;

namespace Application.Services.Logic;

public class SftpConnectionService: ISftpConnectionService
{
    private readonly ConcurrentDictionary<string, SftpClientInstance> _sftpClients = new();
    private readonly IConnectionService _connectionService;
    private readonly object _lock = new();

    public SftpConnectionService(IConnectionService connectionService)
    {
        _connectionService = connectionService;
    }

    private const int IdleTimeoutMinutes = 60;
    
    public SftpClient? GetClient(string connectionKey)
    {
        if (_sftpClients.TryGetValue(connectionKey, out var sftpClientInstance) &&
            sftpClientInstance.SftpClient.IsConnected)
        {
            return sftpClientInstance.SftpClient;
        }

        return null;
    }

    public SftpClient CreateClient(ConnectionServer connectionServer, string connectionKey)
    {
        var sftpClient = _sftpClients.GetOrAdd(connectionKey, _ => new SftpClientInstance
        {
            SftpClient = CreateNewClientInstance(connectionServer),
            LastUsed = DateTime.Now
        }).SftpClient; 

        if (sftpClient.IsConnected) 
            return sftpClient;
        
        DisconnectClient(connectionKey);
            
        var newSftpClient = _sftpClients.GetOrAdd(connectionKey, _ => new SftpClientInstance
        {
            SftpClient = CreateNewClientInstance(connectionServer),
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
    
    private SftpClient CreateNewClientInstance(ConnectionServer connectionServer)
    {
        var connectionInfo = _connectionService.GetConnectionConfiguration(connectionServer);
        
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
    
    private class SftpClientInstance
    {
        public required SftpClient SftpClient { get; set; }
        public DateTime LastUsed { get; set; }
        
    }

}