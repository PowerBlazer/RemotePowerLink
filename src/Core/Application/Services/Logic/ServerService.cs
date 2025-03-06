using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using Application.Layers.Persistence.Repository;
using Application.Services.Abstract;
using Application.Services.Abstract.Results;
using Domain.DTOs.Connection;
using Domain.Enums;
using Domain.Exceptions;
using Renci.SshNet;

namespace Application.Services.Logic;

public class ServerService: IServerService
{
    private readonly ISystemTypeRepository _systemTypeRepository;
    private readonly IConnectionService _connectionService;
    public ServerService(ISystemTypeRepository systemTypeRepository, IConnectionService connectionService)
    {
        _systemTypeRepository = systemTypeRepository;
        _connectionService = connectionService;
    }
    public async Task<SystemTypeResult> GetSystemType(ConnectionServer server, 
        CancellationToken cancellationToken)
    {
        var connectionInfo = _connectionService.GetConnectionConfiguration(server);
        
        using var client = new SshClient(connectionInfo);
        
        var systemTypeResult = new SystemTypeResult
        {
            SystemTypeId = 1,
            Name = "Default"
        };

        try
        {
            await client.ConnectAsync(cancellationToken);

            var responseCat = client.RunCommand("cat /etc/os-release").Result;
            
            foreach (SystemTypeEnum systemTypeEnumItem in Enum.GetValues(typeof(SystemTypeEnum)))
            {
                var enumMember = typeof(SystemTypeEnum)
                    .GetMember(systemTypeEnumItem.ToString())
                    .FirstOrDefault();

                if (enumMember == null)
                    continue;

                var descriptionAttribute = enumMember.GetCustomAttribute<DescriptionAttribute>();

                if (descriptionAttribute != null && (responseCat.Contains(descriptionAttribute.Description) || 
                    client.ConnectionInfo.ServerVersion.Contains(descriptionAttribute.Description)))
                {
                    systemTypeResult = new SystemTypeResult
                    {
                        SystemTypeId = (long)systemTypeEnumItem,
                        Name = systemTypeEnumItem.ToString()
                    };
                }
            }
            
            if (systemTypeResult.SystemTypeId == (long)SystemTypeEnum.Default)
            {
                var responseSystemInfo = client.RunCommand("systeminfo").Result;

                if (responseSystemInfo.Contains("Windows"))
                {
                    systemTypeResult = new SystemTypeResult
                    {
                        SystemTypeId = (long)SystemTypeEnum.Windows,
                        Name = "Windows"
                    };
                }
            }

            var systemType = await _systemTypeRepository.GetSystemType(systemTypeResult.SystemTypeId);

            systemTypeResult.IconPath = systemType.IconPath;
        }
        catch (Exception ex)
        {
            throw new ConnectionServerException(ex.Message, "Hostname");
        }
        finally
        {
            if (client.IsConnected)
                client.Disconnect();
        }

        return systemTypeResult;
    }

    public async Task<bool> CheckConnectionServer(ConnectionServer server, 
        CancellationToken cancellationToken)
    {
        var connectionInfo = _connectionService.GetConnectionConfiguration(server);
        
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
        const string pattern = @"^(((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+[a-zA-Z]{2,63})|((25[0-5]" +
                      @"|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})|(([a-fA-F0-9]" +
                      "{1,4}:){7}[a-fA-F0-9]{1,4})|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]" + 
                      @"{1,4})|(:([0-9a-fA-F]{1,4}:){1,6})|((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+[a-zA-Z]{2,63}):([0-9]{1,5}))$";

        // Проверка строки с использованием регулярного выражения
        return Regex.IsMatch(serverAddress, pattern);
    }
}