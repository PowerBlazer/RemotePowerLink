using Identity.Contexts;
using Identity.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Identity;

public class IdentityUnitOfWork: IIdentityUnitOfWork
{
    private readonly IdentityContext _identityContext;

    public IdentityUnitOfWork(IdentityContext identityContext)
    {
        _identityContext = identityContext;
    }

    public Task ExecuteWithExecutionStrategyAsync(Func<Task> action)
    {
        var executionStrategy = _identityContext.Database.CreateExecutionStrategy();

        return executionStrategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _identityContext.Database.BeginTransactionAsync(); 

            try
            {
                await action();
                await transaction.CommitAsync();
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();
                throw new Exception(e.Message);
            }
        });
    }
}