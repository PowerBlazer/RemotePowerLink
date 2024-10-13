using System.Collections.Concurrent;
using System.Text;
using Application.Services.Abstract;
using Domain.DTOs.Connection;
using Domain.Exceptions;
using Renci.SshNet;

namespace Application.Services.Logic;

public class SftpConnectionService: ISftpConnectionService
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
    
    private static SftpClient CreateNewClientInstance(ConnectionServer connectionServer)
    {
        var connectionInfo = GetConnectionInfo(connectionServer);
        
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
    
    private static ConnectionInfo GetConnectionInfo(ConnectionServer connectionServer)
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
    
    private class SftpClientInstance
    {
        public required SftpClient SftpClient { get; set; }
        public DateTime LastUsed { get; set; }
        
    }

}