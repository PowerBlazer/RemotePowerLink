using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class ProxyConfiguration: IEntityTypeConfiguration<Proxy>
{
    public void Configure(EntityTypeBuilder<Proxy> builder)
    {
        builder.HasIndex(p => new { p.UserId, p.Title });
        builder.HasIndex(p => p.UserId);
        
        builder.Property(p => p.IpAddress).HasMaxLength(50).IsRequired();
        builder.Property(p => p.Title).HasMaxLength(255).IsRequired();

        builder.HasMany(p => p.Servers)
            .WithOne(p => p.Proxy)
            .OnDelete(DeleteBehavior.Cascade)
            .HasForeignKey(p => p.ProxyId);

        builder.HasData(new Proxy
        {
            Id = 1,
            UserId = 2,
            IdentityId = 1,
            Title = "Test1",
            IpAddress = "123",
            SshPort = 0
        });
    }
}