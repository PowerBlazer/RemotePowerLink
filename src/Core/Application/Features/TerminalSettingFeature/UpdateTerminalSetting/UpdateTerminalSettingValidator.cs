using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.TerminalSettingFeature.UpdateTerminalSetting;

[UsedImplicitly]
public class UpdateTerminalSettingValidator: AbstractValidator<UpdateTerminalSettingCommand>
{
    public UpdateTerminalSettingValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
        
        RuleFor(p=> p.TerminalThemeId)
            .NotEmpty().WithMessage("Поле не может быть пустым");

        RuleFor(p => p.FontSize)
            .Must(x => x >= 8 && x <= 28).WithMessage("Возможно указания шрифта в [8, 28] диапазоне");
    }
}