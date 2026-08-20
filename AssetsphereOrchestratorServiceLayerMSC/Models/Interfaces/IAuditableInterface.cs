namespace AssetsphereOrchestratorServiceLayerMSC.Models.Interfaces;

public interface IAuditableInterface
{
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
    string CreatedBy { get; set; }
    string? UpdatedBy { get; set; }
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}
