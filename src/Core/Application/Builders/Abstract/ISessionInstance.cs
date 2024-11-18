using Domain.DTOs.Connection;

namespace Application.Builders.Abstract;

public interface ISessionInstance: IDisposable
{
    long Id { get; set; }
    long UserId { get; set; }
    long ServerId { get; set; }
    DateTime LastUpdated { get; }
    DateTime DateCreated { get; set; }
    Func<string,long,Task>? OutputCallback { get; set; }
    bool IsActive { get; set; }
    bool IsConnected { get; }
    string LogFilePath { get; set; }
    long MaxBufferSize { set; }
    ConnectionServer? ConnectionServer { set; }
    
    Task CreateConnection(CancellationToken cancellationToken);
    Task DiconnectConnection();
    Task WriteCommand(string command);
    Task<string> GetFullSessionData();

}