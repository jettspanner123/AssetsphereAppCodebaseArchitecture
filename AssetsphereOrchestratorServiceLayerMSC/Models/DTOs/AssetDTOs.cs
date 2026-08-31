using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class StorageDriveDTO
{
    public string Capacity { get; set; } = "512 GB";
    public string Type { get; set; } = "NVMe SSD";
}

public sealed class HardwareSpecsDTO
{
    public string? Processor { get; set; }
    public int? RamGbs { get; set; }
    public string? Ram { get; set; }
    public string? Storage { get; set; }
    public List<StorageDriveDTO>? StorageDrives { get; set; }
    public string? ScreenSize { get; set; }
    public string? Resolution { get; set; }
    public string? Graphics { get; set; }
}

public sealed class AssetCreateDTO
{
    public string? AssetTag { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string Category { get; set; } = "Computing";
    public string Subtype { get; set; } = "Laptop";
    public string ModelName { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Status { get; set; } = "In Use";
    public string? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public string? AssignedDepartment { get; set; }
    public DateTime? AssignedDate { get; set; }
    public string Location { get; set; } = "HQ Floor 4";
    public decimal PurchasePrice { get; set; } = 0.0m;
    public string Currency { get; set; } = "USD";
    public decimal CurrentBookValue { get; set; } = 0.0m;
    public string DepreciationMethod { get; set; } = "Straight Line";
    public int UsefulLifeMonths { get; set; } = 36;
    public decimal SalvageValue { get; set; } = 0.0m;
    public HardwareSpecsDTO? Specs { get; set; }
    public string? HardwareSpecsJson { get; set; }
    public string? ProcurementInfoJson { get; set; }
    public string? WarrantyInfoJson { get; set; }
    public string? SecurityAndComplianceJson { get; set; }
    public string? NetworkConfigJson { get; set; }
    public string? HealthMetricJson { get; set; }
    public string? TimelineEventsJson { get; set; }
    public string? MaintenanceHistoryJson { get; set; }
    public string? InstalledSoftwareJson { get; set; }
    public string? Notes { get; set; }
}

public sealed class AssetUpdateDTO
{
    public string? AssetTag { get; set; }
    public string? SerialNumber { get; set; }
    public string? Category { get; set; }
    public string? Subtype { get; set; }
    public string? ModelName { get; set; }
    public string? Manufacturer { get; set; }
    public string? Status { get; set; }
    public string? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public string? AssignedDepartment { get; set; }
    public DateTime? AssignedDate { get; set; }
    public string? Location { get; set; }
    public decimal? PurchasePrice { get; set; }
    public string? Currency { get; set; }
    public decimal? CurrentBookValue { get; set; }
    public string? DepreciationMethod { get; set; }
    public int? UsefulLifeMonths { get; set; }
    public decimal? SalvageValue { get; set; }
    public HardwareSpecsDTO? Specs { get; set; }
    public string? HardwareSpecsJson { get; set; }
    public string? ProcurementInfoJson { get; set; }
    public string? WarrantyInfoJson { get; set; }
    public string? SecurityAndComplianceJson { get; set; }
    public string? NetworkConfigJson { get; set; }
    public string? HealthMetricJson { get; set; }
    public string? TimelineEventsJson { get; set; }
    public string? MaintenanceHistoryJson { get; set; }
    public string? InstalledSoftwareJson { get; set; }
    public string? Notes { get; set; }
}

public sealed class AssetResponseDTO
{
    public Guid Id { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Subtype { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public string? AssignedDepartment { get; set; }
    public DateTime? AssignedDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal CurrentBookValue { get; set; }
    public string DepreciationMethod { get; set; } = string.Empty;
    public int UsefulLifeMonths { get; set; }
    public decimal SalvageValue { get; set; }
    public HardwareSpecsDTO? Specs { get; set; }
    public string? HardwareSpecsJson { get; set; }
    public string? ProcurementInfoJson { get; set; }
    public string? WarrantyInfoJson { get; set; }
    public string? SecurityAndComplianceJson { get; set; }
    public string? NetworkConfigJson { get; set; }
    public string? HealthMetricJson { get; set; }
    public string? TimelineEventsJson { get; set; }
    public string? MaintenanceHistoryJson { get; set; }
    public string? InstalledSoftwareJson { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class AssetLifecycleUpdateDTO
{
    public string NewStatus { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public string? UpdatedBy { get; set; }
}

public sealed class AssetAssignDTO
{
    public string EmployeeId { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? Location { get; set; }
    public DateTime? AssignedDate { get; set; }
}

public sealed class AssetBulkActionDTO
{
    public List<Guid> AssetIds { get; set; } = new();
    public string Action { get; set; } = string.Empty; // "UPDATE_STATUS", "DELETE", "ASSIGN_LOCATION"
    public string? Value { get; set; }
}

public sealed class AssetValuationSummaryRequestDTO
{
    public List<Guid>? AssetIds { get; set; }
}

public sealed class AssetValuationSummaryResponseDTO
{
    public string TargetCurrency { get; set; } = "INR";
    public string TargetCurrencySymbol { get; set; } = "₹";
    public decimal ConvertedTotalValuation { get; set; }
    public decimal TotalUsdValuation { get; set; }
    public decimal TotalInrValuation { get; set; }
    public int UsdAssetCount { get; set; }
    public int InrAssetCount { get; set; }
    public int TotalAssetCount { get; set; }
    public decimal ExchangeRateUsdToInr { get; set; }
    public DateTime ExchangeRateUpdatedAt { get; set; }
}
