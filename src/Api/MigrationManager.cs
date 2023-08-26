using Identity.Contexts;
using Microsoft.EntityFrameworkCore;

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
                identityContext.Database.Migrate();
                
                break;
            }
            catch   
            {
                if (i == 10)
                {
                    throw;
                }

                Thread.Sleep(1000 * i);
            }
        }
    }
}