using System.Text.Json;
using Domain.DTOs;
using Domain.DTOs.Terminal;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Persistence.Configuration;

public class TerminalThemeConfiguration: IEntityTypeConfiguration<TerminalTheme>
{
    public void Configure(EntityTypeBuilder<TerminalTheme> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(100).IsRequired();
        
        var jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "combinedThemes.json");

        if (File.Exists(jsonFilePath))
        {
            var jsonData = File.ReadAllText(jsonFilePath);
            var terminalThemes = JsonConvert.DeserializeObject<List<TerminalThemeMigration>>(jsonData);

            if (terminalThemes is not null)
            {
                var list = new List<TerminalTheme>();

                for (var i = 0; i < terminalThemes.Count; i++)
                {
                    list.Add(new TerminalTheme
                    {
                        Id = i + 1,
                        Name = terminalThemes[i].Name,
                        Black = terminalThemes[i].Black,
                        Red = terminalThemes[i].Red,
                        Green = terminalThemes[i].Green,
                        Yellow = terminalThemes[i].Yellow,
                        Blue = terminalThemes[i].Blue,
                        Purple = terminalThemes[i].Purple,
                        Cyan = terminalThemes[i].Cyan,
                        White = terminalThemes[i].White,
                        BrightBlack = terminalThemes[i].BrightBlack,
                        BrightRed = terminalThemes[i].BrightRed,
                        BrightGreen = terminalThemes[i].BrightGreen,
                        BrightYellow = terminalThemes[i].BrightYellow,
                        BrightBlue = terminalThemes[i].BrightBlue,
                        BrightPurple = terminalThemes[i].BrightPurple,
                        BrightCyan = terminalThemes[i].BrightCyan,
                        BrightWhite = terminalThemes[i].BrightWhite,
                        Background = terminalThemes[i].Background,
                        Foreground = terminalThemes[i].Foreground,
                        Cursor = terminalThemes[i].Cursor,
                        Selection = terminalThemes[i].Selection
                    });
                }

                builder.HasData(list);
            }
        }
    }
}