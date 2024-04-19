using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class EncodingConfiguration: IEntityTypeConfiguration<Encoding>
{
    public void Configure(EntityTypeBuilder<Encoding> builder)
    {
        builder.HasIndex(p => p.CodePage);
        builder.HasIndex(p => p.Name);

        builder.HasMany(p => p.Servers)
            .WithOne(p => p.Encoding)
            .HasForeignKey(p => p.EncodingId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.HasData(
            new Encoding { Id = 1, Name = "UTF-8", CodePage = 65001 },
            new Encoding { Id = 2, Name = "UTF-16", CodePage = 1200 },
            new Encoding { Id = 3, Name = "UTF-16BE", CodePage = 1201 },
            new Encoding { Id = 4, Name = "UTF-32", CodePage = 12000 },
            new Encoding { Id = 5, Name = "UTF-32BE", CodePage = 12001 },
            new Encoding { Id = 6, Name = "Windows-1252", CodePage = 1252 },
            new Encoding { Id = 7, Name = "Windows-1250", CodePage = 1250 },
            new Encoding { Id = 8, Name = "Windows-1251", CodePage = 1251 },
            new Encoding { Id = 9, Name = "Windows-1253", CodePage = 1253 },
            new Encoding { Id = 10, Name = "Windows-1254", CodePage = 1254 },
            new Encoding { Id = 11, Name = "Windows-1255", CodePage = 1255 },
            new Encoding { Id = 12, Name = "Windows-1256", CodePage = 1256 },
            new Encoding { Id = 13, Name = "Windows-1257", CodePage = 1257 },
            new Encoding { Id = 14, Name = "Windows-1258", CodePage = 1258 },
            new Encoding { Id = 15, Name = "ISO-8859-1", CodePage = 28591 },
            new Encoding { Id = 16, Name = "ISO-8859-2", CodePage = 28592 },
            new Encoding { Id = 17, Name = "ISO-8859-5", CodePage = 28595 },
            new Encoding { Id = 18, Name = "ISO-8859-7", CodePage = 28597 },
            new Encoding { Id = 19, Name = "ISO-8859-8", CodePage = 28598 },
            new Encoding { Id = 20, Name = "ISO-8859-9", CodePage = 28599 },
            new Encoding { Id = 21, Name = "KOI8-R", CodePage = 20866 },
            new Encoding { Id = 22, Name = "KOI8-RU", CodePage = 21866 },
            new Encoding { Id = 23, Name = "Shift_JIS", CodePage = 932 },
            new Encoding { Id = 24, Name = "EUC-JP", CodePage = 20932 },
            new Encoding { Id = 25, Name = "CP866", CodePage = 866 },
            new Encoding { Id = 26, Name = "CP1254", CodePage = 1254 },
            new Encoding { Id = 27, Name = "CP1255", CodePage = 1255 },
            new Encoding { Id = 28, Name = "CP1256", CodePage = 1256 },
            new Encoding { Id = 29, Name = "CP1257", CodePage = 1257 },
            new Encoding { Id = 30, Name = "CP1258", CodePage = 1258 },
            new Encoding { Id = 31, Name = "CP437", CodePage = 437 },
            new Encoding { Id = 32, Name = "CP850", CodePage = 850 },
            new Encoding { Id = 33, Name = "CP852", CodePage = 852 },
            new Encoding { Id = 34, Name = "CP855", CodePage = 855 },
            new Encoding { Id = 35, Name = "CP857", CodePage = 857 },
            new Encoding { Id = 36, Name = "CP860", CodePage = 860 },
            new Encoding { Id = 37, Name = "CP861", CodePage = 861 },
            new Encoding { Id = 38, Name = "CP862", CodePage = 862 },
            new Encoding { Id = 39, Name = "CP863", CodePage = 863 },
            new Encoding { Id = 40, Name = "CP864", CodePage = 864 },
            new Encoding { Id = 41, Name = "CP865", CodePage = 865 },
            new Encoding { Id = 42, Name = "CP869", CodePage = 869 },
            new Encoding { Id = 43, Name = "Big5", CodePage = 950 }
        );
    }
}