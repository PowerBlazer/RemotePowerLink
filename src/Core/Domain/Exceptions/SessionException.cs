namespace Domain.Exceptions;

public class SessionException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public SessionException(string key, params string[] errors)
    {
        Errors = new Dictionary<string, List<string>>
        {
            {
                key,
                errors.ToList()
            }
        };
    }
    
    public SessionException(Dictionary<string, List<string>> errors)
    {
        Errors = errors;
    }
}