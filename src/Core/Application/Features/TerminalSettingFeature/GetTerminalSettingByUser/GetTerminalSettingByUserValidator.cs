using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.TerminalSettingFeature.GetTerminalSettingByUser;

[UsedImplicitly]
public class GetTerminalSettingByUserValidator: AbstractValidator<GetTerminalSettingByUserCommand>
{
    public GetTerminalSettingByUserValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");       
    }
}