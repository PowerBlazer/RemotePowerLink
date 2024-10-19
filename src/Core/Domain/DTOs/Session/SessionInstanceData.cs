namespace Domain.DTOs.Session;

public class SessionInstanceData
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public long ServerId { get; set; }
    public DateTime DateCreated { get; set; }
}