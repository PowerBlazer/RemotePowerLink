using Domain.DTOs.Connection;

namespace Application.Builders.Abstract;

public interface ISessionInstance: IDisposable
{
    long Id { get; set; }
    long UserId { get; set; }
    long ServerId { get; set; }
    DateTime LastUpdated { get; set; }
    DateTime DateCreated { get; set; }
    Func<string,long,Task>? OutputCallback { get; set; }
    bool IsActive { get; set; }
    string LogFilePath { get; set; }
    long MaxBufferSize { get; set; }
    ConnectionServer? ConnectionServer { get; set; }
    
    Task CreateConnection(CancellationToken cancellationToken);
    Task DiconnectConnection();
    Task WriteCommand(string command);
    Task<string> GetFullSessionData();

}