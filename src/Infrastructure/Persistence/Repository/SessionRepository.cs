using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class SessionRepository: ISessionRepository
{
    private readonly IPersistenceContext _persistenceContext;

    public SessionRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<IEnumerable<Session>> GetSessionsInUsers(long userId)
    {
        var sessions = await _persistenceContext.Sessions
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return sessions;
    }

    public async Task<Session> GetSession(long sessionId)
    {
        var session = await _persistenceContext.Sessions
            .FirstOrDefaultAsync(p=>p.Id == sessionId);

        if (session is null)
        {
            throw new NotFoundException($"Сессия с указанным SessionId:${sessionId} не найден", "SessionId");
        }

        return session;
    }

    public async Task<Session> AddSession(Session newSession)
    {
        await _persistenceContext.Sessions.AddAsync(newSession);
        await _persistenceContext.SaveChangesAsync();

        return newSession;
    }
}