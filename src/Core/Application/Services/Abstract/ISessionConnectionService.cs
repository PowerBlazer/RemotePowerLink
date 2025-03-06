using Application.Builders.Abstract;

namespace Application.Services.Abstract;

public interface ISessionConnectionService
{
    Task WriteCommand(long sessionId, string command);

    Task<ISessionInstance> CreateSessionInstance(long serverId, long userId, CancellationToken cancellationToken = default);

    Task<ISessionInstance> ActivateSessionInstance(long sessionId);

    IEnumerable<ISessionInstance> GetOpenedSessionsByUser(long userId);

    IEnumerable<ISessionInstance> GetAllOpenedSessions();

    Task CloseSessionInstance(long sessionId);

    void DisactivateSessionInstance(long sessionId);
}