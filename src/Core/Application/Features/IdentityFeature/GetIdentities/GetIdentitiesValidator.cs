using Application.Features.UserFeature.GetUserData;
using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.IdentityFeature.GetIdentities;

[UsedImplicitly]
public class GetIdentitiesValidator: AbstractValidator<GetUserDataCommand>
{
    public GetIdentitiesValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}