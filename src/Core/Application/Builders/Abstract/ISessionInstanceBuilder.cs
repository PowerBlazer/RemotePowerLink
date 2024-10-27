namespace Application.Builders.Abstract;

public interface ISessionInstanceBuilder
{
    ISessionInstanceBuilder SetUser(long userId);
    ISessionInstanceBuilder SetServer(long serverId);
    ISessionInstanceBuilder SetOutputAction(Func<string,long,Task> outputAction);
    ISessionInstanceBuilder SetLogFilePath(string logFilePath);
    ISessionInstanceBuilder SetBufferSize(int bufferSize);
    Task<ISessionInstance> Build();
}