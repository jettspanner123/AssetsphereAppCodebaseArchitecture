using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Notifications.Services;

public interface INotificationsService
{
    Task<List<NotificationResponseDTO>> GetNotificationsAsync(string? userId, string? userRole);
    Task<NotificationResponseDTO?> MarkAsReadAsync(Guid notificationId, string userId);
    Task<int> MarkAllAsReadAsync(string userId, string? userRole);
    Task<NotificationResponseDTO> CreateNotificationAsync(CreateNotificationDTO dto, string createdBy = "system");
    Task<NotificationResponseDTO> DispatchNotificationAsync(
        string heading,
        string description,
        string icon,
        PriorityLevelType priority,
        NotificationType type,
        object? packagedData = null,
        NotificationActionClass? action = null,
        List<string>? targetRoles = null,
        string createdBy = "system"
    );
}
