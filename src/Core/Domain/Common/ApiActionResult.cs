namespace Domain.Common;


public class ApiActionResult<T>
{
    public T? Result { get; set; }
    public Dictionary<string,List<string>>? Errors { get; set; }
}