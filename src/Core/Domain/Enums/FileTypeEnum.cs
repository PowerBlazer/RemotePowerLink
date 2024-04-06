using System.ComponentModel;

namespace Domain.Enums;

public enum FileTypeEnum
{
    [Description("Folder")]
    Folder = 1,
    
    [Description("File")]
    File = 2,
    
    [Description("BackNavigation")]
    BackNavigation = 3
}