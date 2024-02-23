using System.ComponentModel;

namespace Domain.Enums;

public enum SystemTypeEnum
{
    [Description("Windows")]
    Windows = 1,
    [Description("ArchLinux")]
    ArchLinux = 2,
    [Description("OpenSuse")]
    OpenSuse = 3,
    [Description("Fedora")]
    Fedora = 4,
    [Description("CentOS")]
    CentOs = 5,
    [Description("Debian")]
    Debian = 6,
    [Description("MacOS")]
    MacOs = 7,
    [Description("Ubuntu")]
    Ubuntu = 8
}