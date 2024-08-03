namespace Application.Layers.Identity.Models;

public class UpdateUserDataInput
{
    public long UserId { get; set; }
    public string? PhoneNumber { get; set; }
}