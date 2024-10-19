using Application.Builders.Abstract;
using Application.Layers.Persistence.Repository;
using Domain.DTOs.Connection;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.Builders;

public class SshSessionInstanceBuilder: ISessionInstanceBuilder
{
    private readonly IServerRepository _serverRepository;
    private readonly ISessionRepository _sessionRepository;
    
    private readonly ISessionInstance _sessionInstance = new SshSessionInstance();

    public SshSessionInstanceBuilder(IServerRepository serverRepository,
        ISessionRepository sessionRepository)
    {
        _serverRepository = serverRepository;
        _sessionRepository = sessionRepository;
    }
    
    public ISessionInstanceBuilder SetUser(long userId)
    {
        _sessionInstance.UserId = userId;

        return this;
    }

    public ISessionInstanceBuilder SetServer(long serverId)
    {
        _sessionInstance.ServerId = serverId;

        return this;
    }

    public ISessionInstanceBuilder SetOutputAction(Func<string, Task> outputAction)
    {
        _sessionInstance.OutputCallback = outputAction;

        return this;
    }

    public ISessionInstanceBuilder SetUpdateDuration(TimeSpan updateDuration)
    {
        _sessionInstance.UpdateDuration = updateDuration;

        return this;
    }

    public ISessionInstanceBuilder SetLogFilePath(string logFilePath)
    {
        _sessionInstance.LogFilePath = logFilePath;

        return this;
    }

    public ISessionInstanceBuilder SetBufferSize(int bufferSize)
    {
        _sessionInstance.MaxBufferSize = bufferSize;

        return this;
    }

    public async Task<ISessionInstance> Build()
    {
        if (_sessionInstance.UserId == 0 || _sessionInstance.ServerId == 0 || _sessionInstance.OutputCallback == null)
        {
            throw new SessionException("Session","Не заданы обязательные параметры для создание сессии");
        }

        if (string.IsNullOrWhiteSpace(_sessionInstance.LogFilePath))
        {
            throw new SessionException("LogFilePath", "Не задан путь к файлу лога");
        }
        
        var server = await _serverRepository.GetServer(_sessionInstance.ServerId);
        var connectionServer = ConnectionServer.ServerMapTo(server);
        
        var fileName = Path.GetFileName(_sessionInstance.LogFilePath);

        if (!File.Exists(_sessionInstance.LogFilePath))
        {
            File.Create(_sessionInstance.LogFilePath).Close();
        }

        var newSession = new Session
        {
            ServerId = _sessionInstance.ServerId,
            Path = fileName,
            UserId = _sessionInstance.UserId,
            DateCreated = DateTime.Now
        };
        
        var createdSession = await _sessionRepository.AddSession(newSession);
        
        _sessionInstance.Id = createdSession.Id;
        _sessionInstance.ConnectionServer = connectionServer;
        _sessionInstance.IsActive = true;
        _sessionInstance.DateCreated = createdSession.DateCreated;

        return _sessionInstance;
    }
}