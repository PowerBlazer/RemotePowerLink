using FluentValidation;
using MediatR;
using ValidationException = Domain.Exceptions.ValidationException;

namespace Application.Middlewares;

public class ValidatorBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidatorBehavior(IEnumerable<IValidator<TRequest>> validators)
        => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var errors = await Task.WhenAll(_validators
            .Select(p => p.ValidateAsync(request, cancellationToken)));
            
        var errorsDictionary = errors.SelectMany(x => x.Errors)
            .Where(x => x != null)
            .GroupBy(
                x => x.PropertyName,
                x => x.ErrorMessage,
                (propertyName, errorMessages) => new
                {
                    Key = propertyName,
                    Values = errorMessages.Distinct().ToList()
                })
            .ToDictionary(x => x.Key, x => x.Values);
        

        if (errorsDictionary.Count > 0)
        {
            throw new ValidationException(errorsDictionary);
        }

        return await next();
    }
}
