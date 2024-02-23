using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using Application.Layers.Persistence.Services;
using Application.Layers.Persistence.Services.Parameters;
using Application.Layers.Persistence.Services.Parameters.CheckConnectionServer;
using Application.Layers.Persistence.Services.Parameters.GetSystemType;
using Domain.Enums;
using Renci.SshNet;

namespace Persistence.Services;

public class HostService: IHostService
{
    public async Task<SystemTypeEnum?> GetSystemType(GetSystemServerTypeParameter serverParameter, 
        CancellationToken cancellationToken)
    {
        var connectionInfo = GetConnectionInfo(
            serverParameter.Hostname,
            serverParameter.SshPort ?? 22,
            serverParameter.Username,
            serverParameter.Password,
            ProxyTypes.Http,
            serverParameter.Proxy);
        
        using var client = new SshClient(connectionInfo);
        
        try
        {
            await client.ConnectAsync(cancellationToken);
            
            var response = client.RunCommand("cat /etc/os-release").Result;
            
            foreach (SystemTypeEnum systemType in Enum.GetValues(typeof(SystemTypeEnum)))
            {
                var enumMember = typeof(SystemTypeEnum)
                    .GetMember(systemType.ToString())
                    .FirstOrDefault();
                
                if (enumMember == null) 
                    continue;
                
                var descriptionAttribute = enumMember.GetCustomAttribute<DescriptionAttribute>();
                
                if (descriptionAttribute != null && response.Contains(descriptionAttribute.Description))
                    return systemType;
            }

            return null;
        }
        finally
        {
            if (client.IsConnected)
                client.Disconnect();
        }
    }

    public async Task<bool> CheckConnectionServer(CheckConnectionServerParameter serverParameter, 
        CancellationToken cancellationToken)
    {
        var connectionInfo = GetConnectionInfo(
            serverParameter.Hostname,
            serverParameter.SshPort ?? 22,
            serverParameter.Username,
            serverParameter.Password,
            ProxyTypes.Http,
            serverParameter.Proxy);
        
        using var client = new SshClient(connectionInfo);

        try
        {
            await client.ConnectAsync(cancellationToken);

            return client.IsConnected;
        }
        catch (Exception)
        {
            return false;
        }
        finally
        {
            if (client.IsConnected)
                client.Disconnect();
        }
    }

    public bool ValidateServerAddress(string serverAddress)
    {
        // Регулярное выражение для проверки доменного имени или IP-адреса с портом
        var pattern = @"^(((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+[a-zA-Z]{2,63})|((25[0-5]" +
                      @"|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})|(([a-fA-F0-9]" +
                      @"{1,4}:){7}[a-fA-F0-9]{1,4})|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]" + 
                      @"{1,4})|(:([0-9a-fA-F]{1,4}:){1,6})|((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+[a-zA-Z]{2,63}):([0-9]{1,5}))$";

        // Проверка строки с использованием регулярного выражения
        return Regex.IsMatch(serverAddress, pattern);
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