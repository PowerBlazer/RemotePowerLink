namespace Domain.DTOs.Sftp;

public class SendFoldersOrFilesResponse
{
    public Dictionary<string, List<string>>? Errors { get; set; }
}