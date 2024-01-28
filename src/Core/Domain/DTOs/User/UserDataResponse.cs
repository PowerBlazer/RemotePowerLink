using JetBrains.Annotations;

namespace Domain.DTOs.User;

[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class UserDataResponse
{
    public long UserId { get; set; }
    public required string UserName { get; set; }
}