namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class ServiceTicketCreateDTO
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string IssueCategory { get; set; } = "Hardware Repair";
    public string? AssetId { get; set; }
    public string? AssetTag { get; set; }
    public string RequestedByEmployeeId { get; set; } = string.Empty;
    public string RequestedByEmployeeName { get; set; } = string.Empty;
}

public sealed class ServiceTicketUpdateDTO
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public string? IssueCategory { get; set; }
    public string? AssignedTechnicianId { get; set; }
    public string? AssignedTechnicianName { get; set; }
    public decimal? RepairCost { get; set; }
}

public sealed class ServiceTicketResolveDTO
{
    public string ResolutionSummary { get; set; } = string.Empty;
    public decimal RepairCost { get; set; } = 0.0m;
    public string? NewAssetStatus { get; set; } = "In Use";
}

public sealed class ServiceTicketResponseDTO
{
    public Guid Id { get; set; }
    public string TicketNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string IssueCategory { get; set; } = string.Empty;
    public string? AssetId { get; set; }
    public string? AssetTag { get; set; }
    public string RequestedByEmployeeId { get; set; } = string.Empty;
    public string RequestedByEmployeeName { get; set; } = string.Empty;
    public string? AssignedTechnicianId { get; set; }
    public string? AssignedTechnicianName { get; set; }
    public DateTime? ResolutionDate { get; set; }
    public string? ResolutionSummary { get; set; }
    public decimal RepairCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
