namespace Identity.Interfaces;

public interface IIdentityUnitOfWork
{
    Task ExecuteWithExecutionStrategyAsync(Func<Task> action);
}