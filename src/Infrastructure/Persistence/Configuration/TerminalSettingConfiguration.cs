using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configuration;

public class TerminalSettingConfiguration: IEntityTypeConfiguration<TerminalSetting>
{
    public void Configure(EntityTypeBuilder<TerminalSetting> builder)
    {
        builder.Property(p => p.FontSize).HasDefaultValue(14);
        builder.HasOne(p => p.TerminalTheme)
            .WithMany(p => p.TerminalSettings)
            .OnDelete(DeleteBehavior.NoAction)
            .HasForeignKey(f => f.TerminalThemeId);

        builder.HasData(new TerminalSetting
        {
            Id = 1,
            FontSize = 14,
            TerminalThemeId = 1,
            UserId = 1
        });
        
        builder.HasData(new TerminalSetting
        {
            Id = 2,
            FontSize = 14,
            TerminalThemeId = 1,
            UserId = 2
        });
    }
}