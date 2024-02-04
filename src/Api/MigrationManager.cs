using Identity.Contexts;
using Microsoft.EntityFrameworkCore;
using Persistence.Context;

namespace Api;

public static class MigrationManager
{
    public static void MigrateDatabase(this IHost host)
    {
        using var scope = host.Services.CreateScope();

        for (var i = 1; i <= 5; i++)
        {
            try
            {
                using var identityContext = scope.ServiceProvider.GetRequiredService<IdentityContext>();
                using var persistenceContext = scope.ServiceProvider.GetRequiredService<PersistenceContext>();
                identityContext.Database.Migrate();
                persistenceContext.Database.Migrate();
                break;
            }
            catch   
            {
                if (i == 5)
                {
                    throw;
                }

                var delay = TimeSpan.FromSeconds(Enumerable.Range(1, i).Aggregate(1, (f, g) => f * g));
                
                Task.Delay(delay).Wait();
            }
        }
    }
}