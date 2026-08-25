using System.Text.Json;
using System.Text.Json.Serialization;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public record NotificationActionDTO
{
    [JsonPropertyName("kind")]
    public string Kind { get; init; } = "OPEN_PAGE";

    [JsonPropertyName("direction")]
    public string Direction { get; init; } = "requests";
}

public record NotificationResponseDTO
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }

    [JsonPropertyName("heading")]
    public string Heading { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("icon")]
    public string Icon { get; init; } = "Bell";

    [JsonPropertyName("priorityLevel")]
    public string PriorityLevel { get; init; } = "MID";

    [JsonPropertyName("type")]
    public string Type { get; init; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }

    [JsonPropertyName("isRead")]
    public bool IsRead { get; init; }

    [JsonPropertyName("viewByUsers")]
    public List<string> ViewByUsers { get; init; } = new();

    [JsonPropertyName("packagedData")]
    public object? PackagedData { get; init; }

    [JsonPropertyName("action")]
    public NotificationActionDTO Action { get; init; } = new();

    [JsonPropertyName("targetRoles")]
    public List<string> TargetRoles { get; init; } = new();
}

public record CreateNotificationDTO
{
    [JsonPropertyName("heading")]
    public string Heading { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("icon")]
    public string? Icon { get; init; } = "Bell";

    [JsonPropertyName("priorityLevel")]
    public string? PriorityLevel { get; init; } = "MID";

    [JsonPropertyName("type")]
    public string? Type { get; init; }

    [JsonPropertyName("packagedData")]
    public object? PackagedData { get; init; }

    [JsonPropertyName("action")]
    public NotificationActionDTO? Action { get; init; }

    [JsonPropertyName("targetRoles")]
    public List<string> TargetRoles { get; init; } = new() { "OPERATOR", "ADMIN" };
}
