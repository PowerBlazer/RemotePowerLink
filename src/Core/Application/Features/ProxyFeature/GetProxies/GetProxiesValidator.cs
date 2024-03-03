using FluentValidation;
using JetBrains.Annotations;

namespace Application.Features.ProxyFeature.GetProxies;

[UsedImplicitly]
public class GetProxiesValidator: AbstractValidator<GetProxiesCommand>
{
    public GetProxiesValidator()
    {
        RuleFor(p=> p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}