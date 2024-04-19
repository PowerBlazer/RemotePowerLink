using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class ServerConfiguration: IEntityTypeConfiguration<Server>
{
    public void Configure(EntityTypeBuilder<Server> builder)
    {
        builder.HasIndex(p => new { p.Title, p.UserId });
        builder
            .Property(p => p.EncodingId)
            .HasDefaultValue(1);

        builder.Property(p => p.Title).HasMaxLength(255).IsRequired();
        builder.Property(p => p.Id).HasMaxLength(50).IsRequired();
    }
}