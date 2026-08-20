namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class AIQueryRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string? ContextScreen { get; set; }
}

public sealed class AIQueryResponseDTO
{
    public string Answer { get; set; } = string.Empty;
    public string Intent { get; set; } = "GeneralQuery";
    public List<string> SuggestedActions { get; set; } = new();
    public object? DataPayload { get; set; }
}

public sealed class AIRecommendationResponseDTO
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string ImpactLevel { get; set; } = string.Empty;
    public decimal EstimatedSavings { get; set; }
    public string RecommendationText { get; set; } = string.Empty;
    public string ActionType { get; set; } = string.Empty;
    public string? TargetEntityId { get; set; }
    public string? TargetEntityType { get; set; }
    public bool IsApplied { get; set; }
    public bool IsDismissed { get; set; }
    public DateTime CreatedAt { get; set; }
}
