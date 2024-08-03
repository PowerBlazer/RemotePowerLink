using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.UserFeature.UpdateUserData;

/// <summary>
/// Валидатор для команды обновления данных пользователя
/// </summary>
[UsedImplicitly]
public class UpdateUserDataValidator : AbstractValidator<UpdateUserDataCommand>
{
    public UpdateUserDataValidator()
    {
        // Валидация для UserId
        RuleFor(x => x.UserId)
            .GreaterThan(0)
            .WithMessage("Идентификатор пользователя должен быть больше 0.");

        // Валидация для Username
        RuleFor(x => x.Username)
            .NotEmpty()
            .WithMessage("Имя пользователя обязательно для заполнения.")
            .Length(3, 50)
            .WithMessage("Имя пользователя должно содержать от 3 до 50 символов.");

        // Валидация для PhoneNumber
        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber))
            .WithMessage("Номер телефона должен быть в международном формате и содержать только цифры.");
    }
}
