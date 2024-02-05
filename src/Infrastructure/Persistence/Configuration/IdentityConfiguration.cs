using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class IdentityConfiguration: IEntityTypeConfiguration<Identity>
{
    public void Configure(EntityTypeBuilder<Identity> builder)
    {
        builder.HasIndex(p => new { p.UserId, p.Title });
        
        builder.Property(p => p.Username).IsRequired();
        builder.Property(p => p.Password).IsRequired();
        builder.Property(p => p.Title).HasMaxLength(255).IsRequired();

        builder.HasMany(p => p.Proxies)
            .WithOne(p => p.Identity)
            .HasForeignKey(p => p.IdentityId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
        
        builder.HasMany(p => p.Servers)
            .WithOne(p => p.Identity)
            .HasForeignKey(p => p.IdentityId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}