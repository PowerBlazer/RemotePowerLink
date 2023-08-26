namespace Domain.Exceptions;


public class SessionCodeNotFoundException: Exception
{
    public Dictionary<string,List<string>> Error { get; }

    public SessionCodeNotFoundException(string error)
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