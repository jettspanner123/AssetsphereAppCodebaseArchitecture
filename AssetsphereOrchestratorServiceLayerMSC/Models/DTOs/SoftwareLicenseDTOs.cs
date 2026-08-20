namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class SoftwareLicenseCreateDTO
{
    public string SoftwareName { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string LicenseType { get; set; } = "Subscription";
    public string LicenseKey { get; set; } = string.Empty;
    public int TotalSeats { get; set; } = 100;
    public int AssignedSeats { get; set; } = 0;
    public decimal AnnualCost { get; set; } = 0.0m;
    public DateTime ExpiryDate { get; set; } = DateTime.UtcNow.AddYears(1);
    public string ComplianceStatus { get; set; } = "Compliant";
    public string? AssignedUsersJson { get; set; }
    public string? Category { get; set; } = "Productivity";
}

public sealed class SoftwareLicenseUpdateDTO
{
    public string? SoftwareName { get; set; }
    public string? Publisher { get; set; }
    public string? Version { get; set; }
    public string? LicenseType { get; set; }
    public string? LicenseKey { get; set; }
    public int? TotalSeats { get; set; }
    public int? AssignedSeats { get; set; }
    public decimal? AnnualCost { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? ComplianceStatus { get; set; }
    public string? AssignedUsersJson { get; set; }
    public string? Category { get; set; }
}

public sealed class SoftwareLicenseResponseDTO
{
    public Guid Id { get; set; }
    public string SoftwareName { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string LicenseType { get; set; } = string.Empty;
    public string LicenseKey { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
    public int AssignedSeats { get; set; }
    public decimal AnnualCost { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string ComplianceStatus { get; set; } = string.Empty;
    public string? AssignedUsersJson { get; set; }
    public string? Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
