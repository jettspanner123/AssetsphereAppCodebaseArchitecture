namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class VerificationCampaignCreateDTO
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = "All Locations";
    public string Department { get; set; } = "All Departments";
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; } = DateTime.UtcNow.AddDays(30);
    public int TargetAssetCount { get; set; } = 0;
}

public sealed class VerifyScanDTO
{
    public string AssetTag { get; set; } = string.Empty;
    public string ScannedLocation { get; set; } = string.Empty;
    public string ScannedBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public sealed class VerificationScanResultDTO
{
    public bool Success { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsDiscrepancy { get; set; }
    public string? ExpectedLocation { get; set; }
    public string? ScannedLocation { get; set; }
    public int TotalVerified { get; set; }
    public int TotalTarget { get; set; }
    public decimal ProgressPercentage { get; set; }
}

public sealed class VerificationCampaignResponseDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TargetAssetCount { get; set; }
    public int VerifiedAssetCount { get; set; }
    public int DiscrepancyCount { get; set; }
    public decimal ProgressPercentage => TargetAssetCount > 0 ? Math.Round(((decimal)VerifiedAssetCount / TargetAssetCount) * 100, 1) : 0;
    public string? ScannedTagsJson { get; set; }
    public string? DiscrepanciesJson { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
