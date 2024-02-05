using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class ProxyConfiguration: IEntityTypeConfiguration<Proxy>
{
    public void Configure(EntityTypeBuilder<Proxy> builder)
    {
        builder.HasIndex(p => new { p.UserId, p.Title });
        
        builder.Property(p => p.Ip).HasMaxLength(50).IsRequired();
        builder.Property(p => p.Port).IsRequired();
        builder.Property(p => p.Title).HasMaxLength(255).IsRequired();

        builder.HasMany(p => p.Servers)
            .WithOne(p => p.Proxy)
            .OnDelete(DeleteBehavior.Cascade)
            .HasForeignKey(p => p.ProxyId);
    }
}