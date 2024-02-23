namespace Application.Layers.Persistence.Services.Parameters;

public class ProxyParameter
{
    public required string Hostname { get; set; }
    public int? SshPort { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
}