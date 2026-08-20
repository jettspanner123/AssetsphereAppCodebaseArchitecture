namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class SecurityComplianceFrameworkEntityClass : BaseEntityClass
{
    public string FrameworkName { get; set; } = "SOC 2 Type II";
    public string Version { get; set; } = "2024";
    public decimal ComplianceScore { get; set; } = 92.5m; // 0.0 - 100.0
    public int TotalControls { get; set; } = 48;
    public int PassedControls { get; set; } = 44;
    public int FailedControls { get; set; } = 2;
    public int PendingControls { get; set; } = 2;
    public DateTime LastAuditDate { get; set; } = DateTime.UtcNow.AddMonths(-1);
    public DateTime NextAuditDate { get; set; } = DateTime.UtcNow.AddMonths(5);
    public string Status { get; set; } = "Compliant"; // Compliant, Attention Needed, Non-Compliant
    public string? ControlsBreakdownJson { get; set; }
}
