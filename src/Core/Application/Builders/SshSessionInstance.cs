using System.Net.Sockets;
using System.Text;
using Application.Builders.Abstract;
using Application.Helpers;
using Domain.DTOs.Connection;
using Domain.Exceptions;
using Renci.SshNet;
using Renci.SshNet.Common;

namespace Application.Builders;

public class SshSessionInstance: ISessionInstance
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public long ServerId { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.Now;
    public DateTime DateCreated { get; set; }
    public Func<string,long,Task>? OutputCallback { get; set; }
    public bool IsActive { get; set; }
    public string LogFilePath { get; set; } = string.Empty;
    public long MaxBufferSize { get; set; } = 10 * 1024;
    public ConnectionServer? ConnectionServer { get; set; }

    private SshClient? _client;
    private ShellStream? _stream;
    private readonly StringBuilder _sessionOutput = new();
    public bool IsConnected => _client is not null && _stream is not null && _client.IsConnected;


    public async Task CreateConnection(CancellationToken cancellationToken = default)
    {
        if (ConnectionServer is null)
        {
            return;
        }
        
        var connectionInfo = ConnectionMapper.GetConnectionInfo(ConnectionServer);
        
        _client = new SshClient(connectionInfo);

        try
        {
            await _client.ConnectAsync(cancellationToken);
        
            var terminalModes = new Dictionary<TerminalModes, uint>();
        
            _stream = _client.CreateShellStream(
                "xterm-256color", 
                90, 
                24, 
                1000, 
                600, 
                2048, 
                terminalModes);
            
            _stream.DataReceived += (_, args) =>
            {
                var output = Encoding.UTF8.GetString(args.Data);

                OutputDataReceived(output);
            };
        }
        catch (SocketException)
        {
            throw new SessionException("Connection", "Не удалось подключится к удаленному хосту");
        }
        
    }
    
    public async Task DiconnectConnection()
    {
        WriteFileSessionData();
        
        if (_stream is not null)
        {
            await _stream.DisposeAsync();
        }

        if (_client is not null)
        {
            _client.Disconnect();
            _client.Dispose();
        }
    }

    public async Task WriteCommand(string command)
    {
        if (IsConnected && _stream is not null)
        {
            try
            {
                LastUpdated = DateTime.Now;
                _stream.Write(command);
                await _stream.FlushAsync();
            }
            catch (ObjectDisposedException)
            {
                throw new SessionException("SessionId", $"Соединение закрыто с таким SessionId:{Id}");
            }
        }
        else
        {
            throw new SessionException("SessionId", $"Соединение закрыто с таким SessionId:{Id}");
        }
    }

    public async Task<string> GetFullSessionData()
    {
        var sessionData = new StringBuilder();

        // Чтение данных из файла
        if (!string.IsNullOrEmpty(LogFilePath) && File.Exists(LogFilePath))
        {
            var fileData = await File.ReadAllTextAsync(LogFilePath);
            sessionData.Append(fileData);
        }

        // Добавление данных из буфера
        sessionData.Append(_sessionOutput.ToString());

        return sessionData.ToString();
    }

    public SshClient? GetSshClient()
    {
        return _client;
    }

    private void OutputDataReceived(string output)
    {
        if (IsConnected && OutputCallback is not null)
        {
            _sessionOutput.Append(output);

            // Обновляем LastUpdated при наличии новых данных
            LastUpdated = DateTime.Now; 

            // Если буфер превышает максимальный размер, записываем в файл и очищаем
            if (_sessionOutput.Length > MaxBufferSize)
            {
                WriteFileSessionData();
                
                _sessionOutput.Clear(); 
            }

            if (IsActive)
            {
                OutputCallback(output, Id);
            }
            
        }
    }

    public void Dispose()
    {
        _client?.Dispose();
        _stream?.Dispose();
    }
    
    private void WriteFileSessionData()
    {
        if (!string.IsNullOrEmpty(LogFilePath) && File.Exists(LogFilePath))
        {
            File.AppendAllText(LogFilePath, _sessionOutput.ToString(), Encoding.UTF8);
        }
    }
}