namespace Domain.Exceptions;


public class SessionCodeNotFoundException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public SessionCodeNotFoundException(string error)
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