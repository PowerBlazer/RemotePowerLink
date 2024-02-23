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
            .WithOne(p => p.ServerType)
            .OnDelete(DeleteBehavior.Cascade)
            .HasForeignKey(p => p.ServerTypeId);

        #region HasData
        builder.HasData(
            new SystemType
            {
                Id = 1,
                Name = "Windows",
                Photo = "/ServerTypes/windows.svg"
            },
            new SystemType
            {
                Id = 2,
                Name = "ArchLinux",
                Photo = "/ServerTypes/arch-linux.svg"
            },
            new SystemType
            {
                Id = 3,
                Name = "OpenSuse",
                Photo = "/ServerTypes/opensuse.svg"
            },
            new SystemType
            {
                Id = 4,
                Name = "Fedora",
                Photo = "/ServerTypes/fedora.svg"
            },
            new SystemType
            {
                Id = 5,
                Name = "CentOS",
                Photo = "/ServerTypes/centos.svg"
            },
            new SystemType
            {
                Id = 6,
                Name = "Debian",
                Photo = "/ServerTypes/debian.svg"
            },
            new SystemType
            {
                Id = 7,
                Name = "MacOS",
                Photo = "/ServerTypes/macos.svg"
            },
            new SystemType
            {
                Id = 8,
                Name = "Ubuntu",
                Photo = "/ServerTypes/ubuntu.svg"
            }
        );
        

        #endregion
    }
}