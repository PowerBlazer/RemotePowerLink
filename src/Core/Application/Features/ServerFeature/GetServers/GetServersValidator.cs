using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.ServerFeature.GetServers;

[UsedImplicitly]
public class GetServersValidator: AbstractValidator<GetServersCommand>
{
    public GetServersValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");       
    }
}