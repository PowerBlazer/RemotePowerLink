using Application.Layers.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class PersistenceUnitOfWork: IPersistenceUnitOfWork
{
    private readonly IPersistenceContext _persistenceContext;

    public PersistenceUnitOfWork(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public Task ExecuteWithExecutionStrategyAsync(Func<Task> action)
    {
        var executionStrategy = _persistenceContext.Database.CreateExecutionStrategy();

        return executionStrategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _persistenceContext.Database.BeginTransactionAsync(); 

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