using System.ComponentModel;

namespace Domain.Enums;

public enum SystemTypeEnum
{
    [Description("Default")]
    Default = 1,
    [Description("Windows")]
    Windows = 2,
    [Description("ArchLinux")]
    ArchLinux = 3,
    [Description("OpenSuse")]
    OpenSuse = 4,
    [Description("Fedora")]
    Fedora = 5,
    [Description("CentOS")]
    CentOs = 6,
    [Description("Debian")]
    Debian = 7,
    [Description("MacOS")]
    MacOs = 8,
    [Description("Ubuntu")]
    Ubuntu = 9
}