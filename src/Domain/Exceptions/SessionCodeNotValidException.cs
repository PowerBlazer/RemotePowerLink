namespace Domain.Exceptions;

public class SessionCodeNotValidException: Exception
{
    public Dictionary<string,List<string>> Error { get; }

    public SessionCodeNotValidException(string error)
    {
        Error = new Dictionary<string, List<string>>
        {
            {
                "Session",
                new List<string>
                {
                    error
                }
            }
        };
    }

    
}