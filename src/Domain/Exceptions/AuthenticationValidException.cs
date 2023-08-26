namespace Domain.Exceptions;

public class AuthenticationValidException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public AuthenticationValidException(string parameterName,params string[] errors)
    {
        Errors = new Dictionary<string, List<string>>
        {
            {
                parameterName,
                errors.ToList()
            }
        };
    }
}