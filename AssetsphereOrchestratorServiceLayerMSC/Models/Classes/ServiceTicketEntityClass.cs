namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class ServiceTicketEntityClass : BaseEntityClass
{
    public string TicketNumber { get; set; } = string.Empty; // e.g. TKT-1042
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical
    public string Status { get; set; } = "Open"; // Open, In Progress, Waiting For Parts, Resolved, Closed
    public string IssueCategory { get; set; } = "Hardware Repair";
    public string? AssetId { get; set; }
    public string? AssetTag { get; set; }
    public string RequestedByEmployeeId { get; set; } = string.Empty;
    public string RequestedByEmployeeName { get; set; } = string.Empty;
    public string? AssignedTechnicianId { get; set; }
    public string? AssignedTechnicianName { get; set; }
    public DateTime? ResolutionDate { get; set; }
    public string? ResolutionSummary { get; set; }
    public decimal RepairCost { get; set; } = 0.0m;
}
