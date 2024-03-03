using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class SystemTypeConfiguration: IEntityTypeConfiguration<SystemType>
{
    public void Configure(EntityTypeBuilder<SystemType> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(100).IsRequired();

        builder.HasMany(p => p.Servers)
            .WithOne(p => p.SystemType)
            .OnDelete(DeleteBehavior.Cascade)
            .HasForeignKey(p => p.SystemTypeId);

        #region HasData
        builder.HasData(
            new SystemType
            {
                Id  = 1,
                Name = "Default"
            },
            new SystemType
            {
                Id = 2,
                Name = "Windows",
                IconPath = "/SystemTypes/windows.svg"
            },
            new SystemType
            {
                Id = 3,
                Name = "ArchLinux",
                IconPath = "/SystemTypes/arch-linux.svg"
            },
            new SystemType
            {
                Id = 4,
                Name = "OpenSuse",
                IconPath = "/SystemTypes/opensuse.svg"
            },
            new SystemType
            {
                Id = 5,
                Name = "Fedora",
                IconPath = "/SystemTypes/fedora.svg"
            },
            new SystemType
            {
                Id = 6,
                Name = "CentOS",
                IconPath = "/SystemTypes/centos.svg"
            },
            new SystemType
            {
                Id = 7,
                Name = "Debian",
                IconPath = "/SystemTypes/debian.svg"
            },
            new SystemType
            {
                Id = 8,
                Name = "MacOS",
                IconPath = "/SystemTypes/macos.svg"
            },
            new SystemType
            {
                Id = 9,
                Name = "Ubuntu",
                IconPath = "/SystemTypes/ubuntu.svg"
            }
        );
        

        #endregion
    }
}