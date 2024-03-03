using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.UserFeature.GetUserData;

[UsedImplicitly]
public class GetUserDataValidator: AbstractValidator<GetUserDataCommand>
{
    public GetUserDataValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}