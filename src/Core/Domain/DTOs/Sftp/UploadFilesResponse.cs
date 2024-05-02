namespace Domain.DTOs.Sftp;

public class UploadFilesResponse
{
    public Dictionary<string, List<string>>? Errors { get; set; }
}