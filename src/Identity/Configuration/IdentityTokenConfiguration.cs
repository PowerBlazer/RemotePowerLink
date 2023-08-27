using Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Configuration;

public class IdentityTokenConfiguration: IEntityTypeConfiguration<IdentityToken>
{
    public void Configure(EntityTypeBuilder<IdentityToken> builder)
    {
        builder.HasIndex(p => p.Token).IsUnique();
        builder.Property(p => p.Token).IsRequired();
        
        builder.HasIndex(p => p.IpAddress).IsUnique();
        builder.Property(p => p.IpAddress).IsRequired();

        builder
            .HasOne(p => p.User)
            .WithMany(p => p.IdentityToken)
            .HasForeignKey(p => p.UserId);


        #region HasData

        builder.HasData(
            new IdentityToken
            {
                Id = 1,
                UserId = 1,
                Token = "121212121212121",
                Expiration = DateTime.Now.AddDays(7),
                IpAddress = "023424924"
            }, 
            new IdentityToken
            {
                Id = 2,
                UserId = 2,
                Token = "1212121212121212",
                Expiration = DateTime.Now.AddDays(7),
                IpAddress = "12034024"
            });

        #endregion
        
    }
}