namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class VerificationCampaignEntityClass : BaseEntityClass
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = "All Locations";
    public string Department { get; set; } = "All Departments";
    public string Status { get; set; } = "Active"; // Scheduled, Active, Paused, Completed
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; } = DateTime.UtcNow.AddDays(30);
    public int TargetAssetCount { get; set; } = 0;
    public int VerifiedAssetCount { get; set; } = 0;
    public int DiscrepancyCount { get; set; } = 0;
    public string? ScannedTagsJson { get; set; }
    public string? DiscrepanciesJson { get; set; }
}
