using Application.Builders.Abstract;
using Domain.DTOs.Connection;

namespace Application.Builders;

public class SshSessionInstance: ISessionInstance
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public bool IsConnected { get; set; }
    public DateTime LastUpdated { get; set; }
    public Action<string>? OutputCallback { get; set; }
    public TimeSpan? UpdateDuration { get; set; }
    public bool IsActive { get; set; }

    public Task CreateConnection(ConnectionServer connectionServer)
    {
        throw new NotImplementedException();
    }

    public Task DiconnectConnection()
    {
        throw new NotImplementedException();
    }

    public Task WriteCommand(string command)
    {
        throw new NotImplementedException();
    }

    public Task<string> GetFullSessionData()
    {
        throw new NotImplementedException();
    }
}