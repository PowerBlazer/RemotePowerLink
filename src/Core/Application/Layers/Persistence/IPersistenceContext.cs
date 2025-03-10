﻿using Domain.Entities;
using Domain.Entities.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Layers.Persistence;

public interface IPersistenceContext
{
    DbSet<User> Users { get; }
    DbSet<Domain.Entities.Identity> Identities { get; }
    DbSet<Proxy> Proxies { get; }
    DbSet<Server> Servers { get; }
    DbSet<SystemType> SystemTypes { get; }
    DbSet<Encoding> Encodings { get; }
    DbSet<Session> Sessions { get; }
    DbSet<TerminalSetting> TerminalSettings { get; }
    DbSet<TerminalTheme> TerminalThemes { get; }
    
    Task<int> SaveChangesAsync();
    EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
    DbSet<TEntity> Set<TEntity>() where TEntity : BaseEntity<long>;
    void Attach<TEntity>(TEntity entity) where TEntity : BaseEntity<long>;
    public DatabaseFacade Database { get; }
}