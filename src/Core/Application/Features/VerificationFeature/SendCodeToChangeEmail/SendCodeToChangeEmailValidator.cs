using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.SendCodeToChangeEmail;

[UsedImplicitly]
public class SendCodeToChangeEmailValidator: AbstractValidator<SendCodeToChangeEmailCommand>
{
    public SendCodeToChangeEmailValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}