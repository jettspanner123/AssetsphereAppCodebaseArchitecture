namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class SoftwareLicenseEntityClass : BaseEntityClass
{
    public string SoftwareName { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string LicenseType { get; set; } = "Subscription"; // Subscription, Perpetual, Open Source, OEM
    public string LicenseKey { get; set; } = string.Empty;
    public int TotalSeats { get; set; } = 100;
    public int AssignedSeats { get; set; } = 0;
    public decimal CostPerSeat { get; set; } = 0.0m;
    public decimal AnnualCost { get; set; } = 0.0m;
    public string Currency { get; set; } = "USD";
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpiryDate { get; set; } = DateTime.UtcNow.AddYears(1);
    public string ComplianceStatus { get; set; } = "Compliant"; // Compliant, Over Allocated, Expiring Soon, Under Utilized
    public string? AssignedUsersJson { get; set; }
    public string? AssignedDepartmentsJson { get; set; }
    public string? Category { get; set; } = "Productivity";
}
