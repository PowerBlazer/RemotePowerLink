﻿using Application.Layers.Identity;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.AuthorizationFeature.LoginUser;

[UsedImplicitly]
public class LoginUserValidator: AbstractValidator<LoginUserCommand>
{
    public LoginUserValidator(IEmailService emailService)
    {
        RuleFor(p => p.Email)
            .NotEmpty()
            .WithMessage("Поле не может быть пустым")
            .MustAsync((email, _) => emailService.ContainEmail(email))
            .WithMessage("Пользователь с такой почтой не зарегестрирован");

        RuleFor(p => p.Password)
            .NotEmpty()
            .WithMessage("Поле не может быть пустым");
    }
}