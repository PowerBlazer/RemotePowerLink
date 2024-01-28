namespace Domain.Exceptions;

public class NotFoundException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public NotFoundException(string error)
    {
        Errors = new Dictionary<string, List<string>>
        {
            {
                "User",
                new List<string>
                {
                    error
                }
            }
        };
    }

    public NotFoundException(Dictionary<string, List<string>> errors)
    {
        Errors = errors;
    }
}