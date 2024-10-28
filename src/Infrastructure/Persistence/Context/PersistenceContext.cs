using Application.Layers.Persistence;
using Domain.Entities;
using Domain.Entities.Abstractions;
using Microsoft.EntityFrameworkCore;
using Persistence.Configuration;


namespace Persistence.Context;

public class PersistenceContext: DbContext, IPersistenceContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Identity> Identities => Set<Identity>();
    public DbSet<Proxy> Proxies => Set<Proxy>();
    public DbSet<Server> Servers => Set<Server>();
    public DbSet<SystemType> SystemTypes => Set<SystemType>();
    public DbSet<Encoding> Encodings => Set<Encoding>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<TerminalSetting> TerminalSettings => Set<TerminalSetting>();
    public DbSet<TerminalTheme> TerminalThemes => Set<TerminalTheme>();

    public PersistenceContext(DbContextOptions<PersistenceContext> options): base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
    
    public Task<int> SaveChangesAsync()
    {
        return base.SaveChangesAsync();
    }

    public new DbSet<TEntity> Set<TEntity>() where TEntity : BaseEntity<long>
    {
        return base.Set<TEntity>();
    }

    public new void Attach<TEntity>(TEntity entity) where TEntity : BaseEntity<long>
    {
        base.Attach(entity);
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new IdentityConfiguration());
        modelBuilder.ApplyConfiguration(new ServerConfiguration());
        modelBuilder.ApplyConfiguration(new ProxyConfiguration());
        modelBuilder.ApplyConfiguration(new SystemTypeConfiguration());
        modelBuilder.ApplyConfiguration(new EncodingConfiguration());
        modelBuilder.ApplyConfiguration(new SessionConfiguration());
        modelBuilder.ApplyConfiguration(new TerminalThemeConfiguration());
        modelBuilder.ApplyConfiguration(new TerminalSettingConfiguration());
    }
}