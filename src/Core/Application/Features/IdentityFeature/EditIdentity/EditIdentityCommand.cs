using Domain.DTOs.Identity;
using Domain.Entities;
using MediatR;

namespace Application.Features.IdentityFeature.EditIdentity;


/// <summary>
/// Команда для обновления данных идентификации для авторизации по протоколу SSH.
/// </summary>
public class EditIdentityCommand: IRequest<EditIdentityResponse>
{
    /// <summary>
    /// Id идентификатора
    /// </summary>
    public required long IdentityId { get; set; }
    /// <summary>
    /// Название идентификации.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Имя пользователя для авторизации.
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Пароль для авторизации.
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    /// Идентификатор пользователя, которому принадлежит эта идентификация.
    /// </summary>
    public long UserId { get; set; }

    public static Identity MapToIdentity(EditIdentityCommand editIdentityCommand)
    {
        return new Identity
        {
            Id = editIdentityCommand.IdentityId,
            Title = editIdentityCommand.Title,
            Username = editIdentityCommand.Username,
            Password = editIdentityCommand.Password,
            DateCreated = DateTime.Now,
            UserId = editIdentityCommand.UserId
        };
    }
}