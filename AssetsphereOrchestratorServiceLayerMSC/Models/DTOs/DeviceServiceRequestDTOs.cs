namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public class CreateDeviceServiceRequestDTO
{
    // Target user (optional for standard user - defaults to requester; required for Operator if selecting someone else)
    public string? TargetUserId { get; set; }
    public string? TargetUserName { get; set; }
    public string? TargetUserEmail { get; set; }

    // Device
    public string? AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;

    // Parameters
    public string ServiceCategory { get; set; } = string.Empty;
    public string ComponentSubtype { get; set; } = string.Empty;
    public string UsabilityState { get; set; } = string.Empty;
    public string ServiceChannel { get; set; } = string.Empty;
    public string Urgency { get; set; } = "MEDIUM";
    public string WorkLocation { get; set; } = string.Empty;

    // Rich Text Description
    public string DescriptionRichText { get; set; } = string.Empty;
}

public class UpdateDeviceServiceRequestStatusDTO
{
    public string Status { get; set; } = string.Empty;
    public string? ResolutionNotes { get; set; }
}

public class AdminUpdateDeviceServiceRequestDTO
{
    public string? TargetUserId { get; set; }
    public string? TargetUserName { get; set; }
    public string? TargetUserEmail { get; set; }

    public string? AssetId { get; set; }
    public string? AssetTag { get; set; }
    public string? AssetName { get; set; }

    public string? ServiceCategory { get; set; }
    public string? ComponentSubtype { get; set; }
    public string? UsabilityState { get; set; }
    public string? ServiceChannel { get; set; }
    public string? Urgency { get; set; }
    public string? WorkLocation { get; set; }

    public string? DescriptionRichText { get; set; }
    public string? Status { get; set; }
    public string? ResolutionNotes { get; set; }
}

public class DeviceServiceRequestResponseDTO
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;

    public string RequesterUserId { get; set; } = string.Empty;
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public string RequesterRole { get; set; } = string.Empty;

    public string TargetUserId { get; set; } = string.Empty;
    public string TargetUserName { get; set; } = string.Empty;
    public string TargetUserEmail { get; set; } = string.Empty;

    public string? AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;

    public string ServiceCategory { get; set; } = string.Empty;
    public string ComponentSubtype { get; set; } = string.Empty;
    public string UsabilityState { get; set; } = string.Empty;
    public string ServiceChannel { get; set; } = string.Empty;
    public string Urgency { get; set; } = "MEDIUM";
    public string WorkLocation { get; set; } = string.Empty;

    public string DescriptionRichText { get; set; } = string.Empty;
    public string Status { get; set; } = "PENDING";
    public string? ResolutionNotes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string? UpdatedBy { get; set; }
    public string? UpdatedByUserId { get; set; }

    public string? EditHistory { get; set; }
    public string? OriginalData { get; set; }
}
