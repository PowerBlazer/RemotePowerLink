namespace Application.Layers.Persistence.Services.Results;

public class SystemTypeResult
{
    public required long SystemTypeId { get; set; }
    public required string Name { get; set; }
    public string? IconPath { get; set; }
}