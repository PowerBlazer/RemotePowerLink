using FluentValidation;

namespace Application.Features.ProxyFeature.GetProxies;

public class GetProxiesValidator: AbstractValidator<GetProxiesCommand>
{
    public GetProxiesValidator()
    {
        RuleFor(p=>p.UserId)
            .NotEmpty().WithMessage("Поле не может быть пустым");
    }
}