using Domain.DTOs.Connection;

namespace Application.Builders.Abstract;

public interface ISessionInstance: IDisposable
{
    long Id { get; set; }
    long UserId { get; set; }
    DateTime LastUpdated { get; set; }
    Action<string>? OutputCallback { get; set; }
    TimeSpan UpdateDuration { get; set; } 
    bool IsActive { get; set; }
    string LogFilePath { get; set; }
    long MaxBufferSize { get; set; }
    
    Task CreateConnection(ConnectionServer connectionServer, CancellationToken cancellationToken);
    Task DiconnectConnection();
    Task WriteCommand(string command);
    Task<string> GetFullSessionData();

}