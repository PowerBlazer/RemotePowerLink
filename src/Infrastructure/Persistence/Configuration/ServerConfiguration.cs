using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class ServerConfiguration: IEntityTypeConfiguration<Server>
{
    public void Configure(EntityTypeBuilder<Server> builder)
    {
        builder.HasIndex(p => new { p.Name, p.UserId });

        builder.Property(p => p.Name).HasMaxLength(255).IsRequired();
        builder.Property(p => p.Id).HasMaxLength(50).IsRequired();
    }
}