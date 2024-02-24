namespace Domain.Exceptions;

public class ConnectionServerException : Exception
{
    public Dictionary<string, List<string>> Errors { get; }

    public ConnectionServerException(string error, string key)
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

    public ConnectionServerException(Dictionary<string, List<string>> errors)
    {
        Errors = errors;
    }
}