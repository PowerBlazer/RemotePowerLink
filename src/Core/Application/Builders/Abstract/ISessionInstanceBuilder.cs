using Domain.DTOs.Connection;

namespace Application.Builders.Abstract;

public interface ISessionInstanceBuilder
{
    ISessionInstanceBuilder SetUser(long userId);
    ISessionInstanceBuilder SetServer(long serverId);
    ISessionInstanceBuilder SetOutputAction(Func<string,Task> outputAction);
    ISessionInstanceBuilder SetUpdateDuration(TimeSpan updateDuration);
    ISessionInstanceBuilder SetLogFilePath(string logFilePath);
    ISessionInstanceBuilder SetBufferSize(int bufferSize);
    Task<ISessionInstance> Build();
}