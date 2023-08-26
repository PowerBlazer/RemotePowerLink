using Identity.Configuration;
using Identity.Entities;
using Microsoft.EntityFrameworkCore;

namespace Identity.Contexts;

public class IdentityContext : DbContext
{
    public DbSet<IdentityUser> IdentityUsers => Set<IdentityUser>();
    public DbSet<IdentityToken> IdentityTokens => Set<IdentityToken>();

    public IdentityContext(DbContextOptions<IdentityContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new IdentityUserConfiguration());
        modelBuilder.ApplyConfiguration(new IdentityTokenConfiguration());
    }
    
    public async Task ExecuteWithExecutionStrategyAsync(Func<Task> action)
    {
        var executionStrategy = Database.CreateExecutionStrategy();

        await executionStrategy.ExecuteAsync(async () =>
        {
            await using var transaction = await Database.BeginTransactionAsync(); 

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