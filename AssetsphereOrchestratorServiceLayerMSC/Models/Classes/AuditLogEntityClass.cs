namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class AuditLogEntityClass : BaseEntityClass
{
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Action { get; set; } = "CREATE"; // CREATE, UPDATE, DELETE, STATUS_CHANGE, ASSIGN, SCAN
    public string PerformedBy { get; set; } = "system";
    public string? DetailsJson { get; set; }
    public string? IpAddress { get; set; }
}
