using Application.Features.AuthorizationFeature.RefreshToken;
using FluentValidation;
using JetBrains.Annotations;

namespace PowerMessenger.Application.Features.AuthorizationFeature.RefreshToken;

[UsedImplicitly]
public class RefreshTokenValidator: AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenValidator()
    {
        RuleFor(p => p.AccessToken)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.RefreshToken)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}