using System.Text.Json.Serialization;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public class NotificationActionClass
{
    [JsonPropertyName("kind")]
    public string Kind { get; set; } = "OPEN_PAGE";

    [JsonPropertyName("direction")]
    public string Direction { get; set; } = "requests";
}

public sealed class NotificationEntityClass : BaseEntityClass
{
    public string Heading { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "Bell";
    public PriorityLevelType PriorityLevel { get; set; } = PriorityLevelType.MID;
    public NotificationType Type { get; set; } = NotificationType.SYSTEM_BROADCAST;
    
    // Array of user/employee IDs who have marked this notification as read
    public List<string> ViewByUsers { get; set; } = new();
    
    // Arbitrary JSON payload
    public string PackagedData { get; set; } = "{}";
    
    // Navigation / trigger action metadata
    public NotificationActionClass Action { get; set; } = new();
    
    // Roles that can receive this notification (e.g. OPERATOR, ADMIN)
    public List<string> TargetRoles { get; set; } = new() { "OPERATOR", "ADMIN" };
}
