using Domain.Layers.Identity;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.AuthorizationFeature.SendEmailVerificationCode;

[UsedImplicitly]
public class SendEmailVerificationValidator: AbstractValidator<SendEmailVerificationCommand>
{
    public SendEmailVerificationValidator(IEmailService emailService)
    {
        RuleFor(p => p.Email)
            .NotEmpty()
                .WithMessage("Поле не может быть пустым")
            .Must(email => emailService.ValidationEmail(email!))
                .WithMessage("Неправильный формат почты")
            .MustAsync(async (email, _) => !await emailService.ContainEmailAsync(email!))
                .WithMessage("Пользователь с такой почтой уже зарегестрирован");
    }
}