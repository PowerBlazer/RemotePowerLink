using Domain.Entities;

namespace Application.Layers.Persistence.Repository;

public interface ISessionRepository
{
    Task<IEnumerable<Session>> GetSessionsInUsers(long userId);
    Task<Session> GetSession(long sessionId);
    Task<Session> AddSession(Session newSession);
}