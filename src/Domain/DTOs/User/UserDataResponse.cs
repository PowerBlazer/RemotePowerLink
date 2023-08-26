namespace Domain.DTOs.User;

public class UserDataResponse
{
    public long UserId { get; set; }
    public required string UserName { get; set; }
    public string? Avatar { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
    public string? Theme { get; set; }
}