namespace Application.Layers.Persistence.Services.Parameters.CheckConnectionServer;

public class CheckConnectionServerParameter
{
    public required string Hostname { get; set; }
    public int? SshPort { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public ProxyParameter? Proxy { get; set; }
}