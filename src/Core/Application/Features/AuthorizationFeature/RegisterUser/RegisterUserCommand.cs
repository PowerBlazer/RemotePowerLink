using System.Text.Json.Serialization;
using Application.Layers.Identity.Models;
using Application.Layers.Identity.Models.Authorization;
using JetBrains.Annotations;
using MediatR;

namespace Application.Features.AuthorizationFeature.RegisterUser;

[UsedImplicitly]
public class RegisterUserCommand: IRequest<RegistrationResponse>
{
    public RegisterUserCommand(string sessionId, string userName, 
        string password, 
        string passwordConfirm)
    {
        SessionId = sessionId;
        UserName = userName;
        Password = password;
        PasswordConfirm = passwordConfirm;
    }
    
    /// <summary>
    /// Id сессии потдвержденной почты
    /// </summary>
    public string SessionId { get; }
    /// <summary>
    /// Имя пользователя
    /// </summary>
    public string UserName { get; } 
    /// <summary>
    /// Пароль
    /// </summary>
    public string Password { get; }
    /// <summary>
    /// Повторный пароль
    /// </summary>
    public string PasswordConfirm { get; }
    /// <summary>
    /// Ip адрес пользователя
    /// </summary>
    [JsonIgnore]
    public string? IpAddress { get; set; }
    [JsonIgnore]
    public string? DeviceName { get; set; }
}