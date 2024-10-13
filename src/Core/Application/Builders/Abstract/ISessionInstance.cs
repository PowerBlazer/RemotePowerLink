using Domain.DTOs.Connection;

namespace Application.Builders.Abstract;

public interface ISessionInstance
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public DateTime LastUpdated { get; set; }
    public Action<string>? OutputCallback { get; set; }
    public TimeSpan? UpdateDuration { get; set; } 
    public bool IsActive { get; set; }
    
    Task CreateConnection(ConnectionServer connectionServer);
    Task DiconnectConnection();
    
    Task WriteCommand(string command);
    
    Task<string> GetFullSessionData();

}