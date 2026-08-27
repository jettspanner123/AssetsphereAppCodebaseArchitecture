namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public static class HealthStatusType
{
    public const string Healthy = "Healthy";
    public const string Degraded = "Degraded";
    public const string Unhealthy = "Unhealthy";
}

public class ComponentHealthDTO
{
    public string ComponentName { get; set; } = string.Empty;
    public string Status { get; set; } = HealthStatusType.Healthy;
    public long LatencyMs { get; set; }
    public string? Details { get; set; }
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
}

public class RuntimeHealthDTO
{
    public string EnvironmentName { get; set; } = string.Empty;
    public string Uptime { get; set; } = string.Empty;
    public double MemoryAllocatedMB { get; set; }
    public int ThreadCount { get; set; }
    public string RuntimeVersion { get; set; } = string.Empty;
}

public class HealthCheckResponseDTO
{
    public string OverallStatus { get; set; } = HealthStatusType.Healthy;
    public long TotalDurationMs { get; set; }
    public ComponentHealthDTO Database { get; set; } = new();
    public RuntimeHealthDTO Runtime { get; set; } = new();
    public List<ComponentHealthDTO> Subsystems { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
