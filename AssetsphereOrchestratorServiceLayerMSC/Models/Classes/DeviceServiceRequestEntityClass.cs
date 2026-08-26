namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class DeviceServiceRequestEntityClass : BaseEntityClass
{
    public string RequestNumber { get; set; } = string.Empty;

    // Requester Information
    public string RequesterUserId { get; set; } = string.Empty;
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public string RequesterRole { get; set; } = string.Empty;

    // Target Beneficiary / Affected User
    public string TargetUserId { get; set; } = string.Empty;
    public string TargetUserName { get; set; } = string.Empty;
    public string TargetUserEmail { get; set; } = string.Empty;

    // Device / Asset Details
    public string? AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;

    // Comprehensive 8-Dropdown Parameters
    public string ServiceCategory { get; set; } = string.Empty;
    public string ComponentSubtype { get; set; } = string.Empty;
    public string UsabilityState { get; set; } = string.Empty;
    public string ServiceChannel { get; set; } = string.Empty;
    public string Urgency { get; set; } = "MEDIUM";
    public string WorkLocation { get; set; } = string.Empty;

    // Rich Text Problem Description
    public string DescriptionRichText { get; set; } = string.Empty;

    // Lifecycle Status: PENDING, IN_REVIEW, IN_PROGRESS, RESOLVED, REJECTED
    public string Status { get; set; } = "PENDING";
    public string? ResolutionNotes { get; set; }

    // Admin & Developer Audit Trail & Original Baseline
    public string? UpdatedByUserId { get; set; }
    public string? EditHistory { get; set; } = "[]";
    public string? OriginalData { get; set; }
}
