using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class SessionConfiguration: IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.HasIndex(p => p.UserId);
        
        builder.HasOne(p => p.Server)
            .WithMany(p => p.Sessions)
            .HasForeignKey(p => p.ServerId);
        
        builder.HasOne(p => p.User)
            .WithMany(p => p.Sessions)
            .HasForeignKey(p=> p.UserId);
    }
}