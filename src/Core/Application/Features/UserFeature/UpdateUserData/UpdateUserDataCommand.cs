using System.Text.Json.Serialization;
using Application.Layers.Identity.Models;
using Domain.Entities;
using MediatR;
using UserData = Domain.DTOs.User.UserData;

namespace Application.Features.UserFeature.UpdateUserData;

/// <summary>
/// Команда для обновления информации пользователя
/// </summary>
public class UpdateUserDataCommand: IRequest<UserData>
{
    /// <summary>
    /// Идентификатор пользователя.
    /// </summary>
    [JsonIgnore]
    public long UserId { get; set; }

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    public required string Username { get; set; }
    
    /// <summary>
    /// Номер телефона
    /// </summary>
    public string? PhoneNumber { get; set; }

    public static User MapToUser(UpdateUserDataCommand updateUserDataCommand, long entityId)
    {
        return new User
        {
            Id = entityId,
            UserId = updateUserDataCommand.UserId,
            Username = updateUserDataCommand.Username
        };
    }

    public static UpdateUserDataInput MapToUpdateUserData(UpdateUserDataCommand updateUserDataCommand)
    {
        return new UpdateUserDataInput
        {
            UserId = updateUserDataCommand.UserId,
            PhoneNumber = updateUserDataCommand.PhoneNumber
        };
    } 
}