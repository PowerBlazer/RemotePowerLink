namespace Domain.Exceptions;

public class NoAccessException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public NoAccessException(string error, string key)
    {
        Errors = new Dictionary<string, List<string>>
        {
            {
                key,
                new List<string>
                {
                    error
                }
            }
        };
    }
    
    public NoAccessException(Dictionary<string, List<string>> errors)
    {
        Errors = errors;
    }
}