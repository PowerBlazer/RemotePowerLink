﻿
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
        if (server.Identity is null)
        {
            throw new NullReferenceException("Невозможно смапиить параметер подключения без Identity в Server");
        }
        
        var serverParameter = new ConnectionServerParameter
        {
            Hostname = server.IpAddress,
            SshPort = server.SshPort,
            Username = server.Identity.Username,
            Password = server.Identity.Password
        };

        if (server.Proxy is not null)
        {
            if (server.Proxy.Identity is null)
            {
                throw new NullReferenceException("Невозможно смапиить параметер подключения без Identity в Proxy");
            }
            
            serverParameter.Proxy = new ProxyParameter
            {
                Hostname = server.Proxy.IpAddress,
                Username = server.Proxy.Identity.Username,
                Password = server.Proxy.Identity.Password,
                SshPort = server.Proxy.SshPort
            };
        }

        return serverParameter;
    }
}