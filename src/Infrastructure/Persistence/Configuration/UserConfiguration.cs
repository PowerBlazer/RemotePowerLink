using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class UserConfiguration: IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(p => p.UserId).IsUnique();
        builder.HasIndex(p => p.Username);

        builder.Property(p => p.UserId).IsRequired();
        builder.Property(p => p.Username).HasMaxLength(255).IsRequired();

        builder.HasMany(p => p.Proxies)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.HasMany(p => p.Identities)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.HasMany(p => p.Servers)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        #region HasData

        builder.HasData(
            new User
            {
                Id = 1,
                UserId = 1,
                Username = "PowerBlaze"
            },
            new User
            {
                Id = 2,
                UserId = 2,
                Username = "PowerBlaze"
            }
        );

        #endregion
    }
}