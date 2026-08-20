using AssetsphereOrchestratorServiceLayerMSC.Models.Interfaces;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public abstract class BaseEntityClass : IAuditableInterface
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = "system";
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
}
