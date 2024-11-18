using Domain.Entities.Abstractions;

namespace Domain.Entities;

public class User: BaseEntity<long>
{
    public required long UserId { get; set; }
    public required string Username { get; set; }
    
    public IList<Identity>? Identities { get; set; }
    public IList<Proxy>? Proxies { get; set; }
    public IList<Server>? Servers { get; set; }
    public IList<Session>? Sessions { get; set; }
    public IList<TerminalSetting>? TerminalSettings { get; set; }
}