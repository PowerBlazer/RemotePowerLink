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
}