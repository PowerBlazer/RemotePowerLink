using System.Text;
using Application.Builders.Abstract;
using Application.Helpers;
using Domain.DTOs.Connection;
using Renci.SshNet;
using Renci.SshNet.Common;

namespace Application.Builders;

public class SshSessionInstance: ISessionInstance
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.Now;
    public Action<string>? OutputCallback { get; set; }
    public TimeSpan UpdateDuration { get; set; } = TimeSpan.FromMilliseconds(200);
    public bool IsActive { get; set; }
    public string LogFilePath { get; set; } = string.Empty;
    public long MaxBufferSize { get; set; } = 10 * 1024; 

    private SshClient? _client;
    private ShellStream? _stream;
    private Timer? _timer;
    private readonly StringBuilder _sessionOutput = new();
    private bool IsConnected => _client is not null && _stream is not null && _client.IsConnected;
    
    public async Task CreateConnection(ConnectionServer connectionServer, CancellationToken cancellationToken = default)
    {
        var connectionInfo = ConnectionMapper.GetConnectionInfo(connectionServer);
        
        _client = new SshClient(connectionInfo);
        await _client.ConnectAsync(cancellationToken);
        
        var terminalModes = new Dictionary<TerminalModes, uint>();
        
        _stream = _client.CreateShellStream(
            "xterm", 
            80, 
            24, 
            800, 
            600, 
            1024, 
            terminalModes);
        
        _timer = new Timer(OutputDataReceived, null, TimeSpan.Zero, UpdateDuration);
    }

    public async Task DiconnectConnection()
    {
        if (_timer is not null)
        {
            await _timer.DisposeAsync();
        }

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
            LastUpdated = DateTime.Now; 
            _stream.Write(command);
            await _stream.FlushAsync();
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

    private void OutputDataReceived(object? _)
    {
        if (IsActive && IsConnected && OutputCallback is not null)
        {
            var buffer = new byte[1024];
            var bytesRead = _stream!.Read(buffer, 0, buffer.Length);

            if (bytesRead > 0)  // Обновляем LastUpdated только если данные были прочитаны
            {
                var output = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                _sessionOutput.Append(output);

                LastUpdated = DateTime.Now;  // Обновляем LastUpdated при наличии новых данных

                // Если буфер превышает максимальный размер, записываем в файл и очищаем
                if (_sessionOutput.Length > MaxBufferSize)
                {
                    WriteBufferToFileAsync();
                    _sessionOutput.Clear();  // Очищаем буфер
                }

                OutputCallback?.Invoke(output);
            }
        }
    }
    private void WriteBufferToFileAsync()
    {
        if (!string.IsNullOrEmpty(LogFilePath) && File.Exists(LogFilePath))
        {
             File.AppendAllText(LogFilePath, _sessionOutput.ToString());
        }
    }

    public void Dispose()
    {
        _client?.Dispose();
        _stream?.Dispose();
        _timer?.Dispose();
    }
}