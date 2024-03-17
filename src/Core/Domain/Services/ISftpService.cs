namespace Domain.Services;

public interface ISftpService
{
    string GetFileExtension(string fileName);
    string FormatFileSize(long fileSize);
}