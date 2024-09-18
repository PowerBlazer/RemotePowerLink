using Application.Layers.Identity;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.SendCodeToConfirmNewEmail;

[UsedImplicitly]
public class SendCodeToConfirmNewEmailValidator: AbstractValidator<SendCodeToConfirmNewEmailCommand>
{
    public SendCodeToConfirmNewEmailValidator(IEmailService emailService)
    {
        RuleFor(p => p.NewEmail)
            .NotEmpty()
            .WithMessage("Поле не может быть пустым")
            .Must(email => emailService.ValidationEmail(email!))
            .WithMessage("Неправильный формат почты")
            .MustAsync(async (email, _) => !await emailService.ContainEmail(email!))
            .WithMessage("Пользователь с такой почтой уже зарегестрирован");
    }
}