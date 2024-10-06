using Application.Layers.Persistence.Repository;
using Domain.Entities;

namespace Persistence.Repository;

public class SessionRepository: ISessionRepository
{
    public Task<IEnumerable<Session>> GetSessionsInUsers(long userId)
    {
        throw new NotImplementedException();
    }

    public Task<Session> GetSession(long sessionId)
    {
        throw new NotImplementedException();
    }

    public Task<Session> AddSession(Session newSession)
    {
        throw new NotImplementedException();
    }
}