using Domain.DTOs.Connection;

namespace Application.Builders.Abstract;

public interface ISessionInstanceBuilder
{
    ISessionInstanceBuilder SetConnectionServer(ConnectionServer connectionServer);
    ISessionInstanceBuilder SetOutputAction(Action<string> outputAction);
    ISessionInstanceBuilder SetUpdateDuration(TimeSpan updateDuration);
    ISessionInstance Build();
}