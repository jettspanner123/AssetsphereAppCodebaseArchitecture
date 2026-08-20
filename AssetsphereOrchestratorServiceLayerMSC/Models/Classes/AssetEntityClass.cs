using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class AssetEntityClass : BaseEntityClass
{
    public string AssetTag { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string Category { get; set; } = "Computing";
    public string Subtype { get; set; } = "Laptop";
    public string ModelName { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Status { get; set; } = "In Use";
    
    // Assignment
    public string? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public DepartmentType? AssignedDepartment { get; set; }
    public string Location { get; set; } = "HQ Floor 4";

    // Financials
    public decimal PurchasePrice { get; set; } = 0.0m;
    public decimal CurrentBookValue { get; set; } = 0.0m;
    public string DepreciationMethod { get; set; } = "Straight Line";
    public int UsefulLifeMonths { get; set; } = 36;
    public decimal SalvageValue { get; set; } = 0.0m;

    // Rich JSON configurations / metadata stored in Postgres JSONB
    public string? HardwareSpecsJson { get; set; }
    public string? ProcurementInfoJson { get; set; }
    public string? WarrantyInfoJson { get; set; }
    public string? SecurityAndComplianceJson { get; set; }
    public string? NetworkConfigJson { get; set; }
    public string? HealthMetricJson { get; set; }
    public string? TimelineEventsJson { get; set; }
    public string? MaintenanceHistoryJson { get; set; }
    public string? InstalledSoftwareJson { get; set; }
    public string? CustomAttributesJson { get; set; }

    public string? Notes { get; set; }
}
