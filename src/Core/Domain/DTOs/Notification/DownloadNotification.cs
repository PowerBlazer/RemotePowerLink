namespace Domain.DTOs.Notification;

public class DownloadNotification
{
    public required string OperationName { get; set; }
    public string? InformationText { get; set; }
    public bool IsProgress { get; set; }
    public int? ProgressPercent { get; set; }
}