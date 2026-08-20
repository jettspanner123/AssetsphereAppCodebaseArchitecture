namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class ComplianceCreateDTO
{
    public string FrameworkName { get; set; } = "SOC 2 Type II";
    public string Version { get; set; } = "2024";
    public decimal ComplianceScore { get; set; } = 90.0m;
    public int TotalControls { get; set; } = 48;
    public int PassedControls { get; set; } = 44;
    public int FailedControls { get; set; } = 2;
    public int PendingControls { get; set; } = 2;
    public DateTime LastAuditDate { get; set; } = DateTime.UtcNow;
    public DateTime NextAuditDate { get; set; } = DateTime.UtcNow.AddMonths(6);
    public string Status { get; set; } = "Compliant";
    public string? ControlsBreakdownJson { get; set; }
}

public sealed class ComplianceResponseDTO
{
    public Guid Id { get; set; }
    public string FrameworkName { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public decimal ComplianceScore { get; set; }
    public int TotalControls { get; set; }
    public int PassedControls { get; set; }
    public int FailedControls { get; set; }
    public int PendingControls { get; set; }
    public DateTime LastAuditDate { get; set; }
    public DateTime NextAuditDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ControlsBreakdownJson { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class BaselineScoreResponseDTO
{
    public decimal OverallScore { get; set; }
    public int TotalDevicesAudited { get; set; }
    public int FullyCompliantDevices { get; set; }
    public int NonCompliantDevices { get; set; }
    public decimal AntivirusCoveragePct { get; set; }
    public decimal EncryptionCoveragePct { get; set; }
    public decimal PatchCompliancePct { get; set; }
}
