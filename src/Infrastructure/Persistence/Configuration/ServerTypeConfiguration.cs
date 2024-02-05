using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class ServerTypeConfiguration: IEntityTypeConfiguration<ServerType>
{
    public void Configure(EntityTypeBuilder<ServerType> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(100).IsRequired();

        builder.HasMany(p => p.Servers)
            .WithOne(p => p.ServerType)
            .OnDelete(DeleteBehavior.Cascade)
            .HasForeignKey(p => p.ServerTypeId);

        #region HasData
        builder.HasData(
            new ServerType
            {
                Id = 1,
                Name = "Windows",
                Photo = "/ServerTypes/windows.svg"
            },
            new ServerType
            {
                Id = 2,
                Name = "ArchLinux",
                Photo = "/ServerTypes/arch-linux.svg"
            },
            new ServerType
            {
                Id = 3,
                Name = "OpenSuse",
                Photo = "/ServerTypes/opensuse.svg"
            },
            new ServerType
            {
                Id = 4,
                Name = "Fedora",
                Photo = "/ServerTypes/fedora.svg"
            },
            new ServerType
            {
                Id = 5,
                Name = "CentOS",
                Photo = "/ServerTypes/centos.svg"
            },
            new ServerType
            {
                Id = 6,
                Name = "Debian",
                Photo = "/ServerTypes/debian.svg"
            },
            new ServerType
            {
                Id = 7,
                Name = "MacOS",
                Photo = "/ServerTypes/macos.svg"
            },
            new ServerType
            {
                Id = 8,
                Name = "Ubuntu",
                Photo = "/ServerTypes/ubuntu.svg"
            }
        );
        

        #endregion
    }
}