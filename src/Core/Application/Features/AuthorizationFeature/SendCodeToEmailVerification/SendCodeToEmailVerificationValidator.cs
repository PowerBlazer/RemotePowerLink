using Application.Layers.Identity;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.AuthorizationFeature.SendCodeToEmailVerification;

[UsedImplicitly]
public class SendCodeToEmailVerificationValidator: AbstractValidator<SendCodeToEmailVerificationCommand>
{
    public SendCodeToEmailVerificationValidator(IEmailService emailService)
    {
        RuleFor(p => p.Email)
            .NotEmpty()
                .WithMessage("Поле не может быть пустым")
            .Must(email => emailService.ValidationEmail(email!))
                .WithMessage("Неправильный формат почты")
            .MustAsync(async (email, _) => !await emailService.ContainEmail(email!))
                .WithMessage("Пользователь с такой почтой уже зарегестрирован");
    }
}