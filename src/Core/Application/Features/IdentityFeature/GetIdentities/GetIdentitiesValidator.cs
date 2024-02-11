using Application.Features.UserFeature.GetUserData;
using FluentValidation;

namespace Application.Features.IdentityFeature.GetIdentities;

public class GetIdentitiesValidator: AbstractValidator<GetUserDataCommand>
{
    public GetIdentitiesValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}