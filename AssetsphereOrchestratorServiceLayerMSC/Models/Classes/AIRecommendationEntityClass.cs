namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class AIRecommendationEntityClass : BaseEntityClass
{
    public string Category { get; set; } = "Cost Optimization"; // Cost Optimization, Warranty Renewal, Compliance, Security, Refresh Cycle
    public string Title { get; set; } = string.Empty;
    public string ImpactLevel { get; set; } = "High"; // Low, Medium, High, Critical
    public decimal EstimatedSavings { get; set; } = 0.0m;
    public string RecommendationText { get; set; } = string.Empty;
    public string ActionType { get; set; } = "Deprecate"; // Deprecate, Renew, Upgrade, Reallocate, Purchase
    public string? TargetEntityId { get; set; }
    public string? TargetEntityType { get; set; }
    public bool IsApplied { get; set; } = false;
    public bool IsDismissed { get; set; } = false;
}
