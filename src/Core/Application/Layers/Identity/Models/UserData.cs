namespace Application.Layers.Identity.Models;

public class UserData
{
    public required long UserId { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTimeOffset DateCreated { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }

    public static void SetIdentityDataToUserData(UserData userData, ref Domain.DTOs.User.UserData currentUserData)
    {
        currentUserData.Email = userData.Email;
        currentUserData.DateCreated = userData.DateCreated;
        currentUserData.EmailConfirmed = userData.EmailConfirmed;
        currentUserData.PhoneNumber = userData.PhoneNumber;
        currentUserData.TwoFactorEnabled = userData.TwoFactorEnabled;
    }
}