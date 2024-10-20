﻿using Application.Layers.MessageQueues.UserRegistered;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using MassTransit;

namespace MessageQueues.UserRegistered;


public class UserRegisteredConsumer: IConsumer<UserRegisteredEvent>
{
    private readonly IUserRepository _userRepository;
    public UserRegisteredConsumer(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Consume(ConsumeContext<UserRegisteredEvent> context)
    {
        await _userRepository.AddUser(new User
        {
            UserId = context.Message.UserId,
            Username = context.Message.UserName
        });
    }
}