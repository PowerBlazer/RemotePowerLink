namespace Domain.Exceptions;

public class SftpException: Exception
{
    public Dictionary<string,List<string>> Errors { get; }

    public SftpException(string key, params string[] errors)
    {
        Errors = new Dictionary<string, List<string>>
        {
            {
                key,
                errors.ToList()
            }
        };
    }
    
    public SftpException(Dictionary<string, List<string>> errors)
    {
        Errors = errors;
    }
}