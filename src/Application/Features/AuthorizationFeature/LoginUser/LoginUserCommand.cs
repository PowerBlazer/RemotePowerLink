using System.Text.Json.Serialization;
using Domain.DTOs.Authorization;
using MediatR;

namespace Application.Features.AuthorizationFeature.LoginUser;

public class LoginUserCommand: IRequest<LoginResponse>
{
    public LoginUserCommand(string email, string password)
    {
        Email = email;
        Password = password;
    }

    public string Email { get; }
    public string Password { get; }
    
    [JsonIgnore]
    public string? IpAddress { get; set; }
    [JsonIgnore]
    public string? DeviceName { get; set; }
}