﻿using Domain.DTOs.Identity;
using Domain.Entities;
using MediatR;

namespace Application.Features.IdentityFeature.CreateIdentity;

/// <summary>
/// Команда для создания новой идентификации для авторизации по протоколу SSH.
/// </summary>
public class CreateIdentityCommand : IRequest<CreateIdentityResponse>
{
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

    public static Identity MapToIdentity(CreateIdentityCommand createIdentityCommand)
    {
        return new Identity
        {
            Title = createIdentityCommand.Title,
            Username = createIdentityCommand.Username,
            Password = createIdentityCommand.Password,
            DateCreated = DateTime.Now,
            UserId = createIdentityCommand.UserId
        };
    }
}
