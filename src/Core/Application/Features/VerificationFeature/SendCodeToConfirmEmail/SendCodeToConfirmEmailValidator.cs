using Application.Layers.Identity;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.SendCodeToConfirmEmail;

[UsedImplicitly]
public class SendCodeToConfirmEmailValidator: AbstractValidator<SendCodeToConfirmEmailCommand>
{
    public SendCodeToConfirmEmailValidator(IEmailService emailService)
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