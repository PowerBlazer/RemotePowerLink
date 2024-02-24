namespace Domain.Exceptions;

public class SessionCodeNotValidException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public SessionCodeNotValidException(string error)
    {
        Errors = new Dictionary<string, List<string>>
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