using FluentValidation;

namespace Application.Features.UserFeature.GetUserData;

public class GetUserDataValidator: AbstractValidator<GetUserDataCommand>
{
    public GetUserDataValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}