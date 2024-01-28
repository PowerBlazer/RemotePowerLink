using Identity.Contexts;
using Microsoft.EntityFrameworkCore;
using Persistence.Context;

namespace Api;

public static class MigrationManager
{
    public static void MigrateDatabase(this IHost host)
    {
        using var scope = host.Services.CreateScope();

        for (var i = 1; i <= 10; i++)
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
                if (i == 10)
                {
                    throw;
                }

                var delay = TimeSpan.FromSeconds(i);
                Task.Delay(delay).Wait();
            }
        }
    }
}