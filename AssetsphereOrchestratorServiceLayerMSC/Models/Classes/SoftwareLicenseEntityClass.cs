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
    public decimal AnnualCost { get; set; } = 0.0m;
    public DateTime ExpiryDate { get; set; } = DateTime.UtcNow.AddYears(1);
    public string ComplianceStatus { get; set; } = "Compliant"; // Compliant, Overutilized, Expiring Soon, Non-Compliant
    public string? AssignedUsersJson { get; set; }
    public string? Category { get; set; } = "Productivity";
}
