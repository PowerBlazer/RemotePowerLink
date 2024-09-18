using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.VerificationFeature.SendCodeToUpdatePassword;

[UsedImplicitly]
public class SendCodeUpdatePasswordValidator: AbstractValidator<SendCodeUpdatePasswordCommand>
{
    public SendCodeUpdatePasswordValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}