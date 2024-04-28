namespace Domain.DTOs.Sftp;

public class DownloadFolderOrFilesResponse
{
    public required string FolderTempPath { get; set; }
    public Dictionary<string, List<string>>? Errors { get; set; }
}

