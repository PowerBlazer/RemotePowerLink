namespace Domain.DTOs.Sftp;

public class SftpFileList
{
    public required string CurrentPath { get; set; }
    public required IEnumerable<SftpFileData> FileList { get; set; }
}