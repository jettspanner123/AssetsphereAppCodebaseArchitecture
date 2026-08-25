using System.Text.Json;
using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Notifications.Services;

public sealed class NotificationsService : INotificationsService
{
    private readonly AssetsphereDbContext _context;

    public NotificationsService(AssetsphereDbContext context)
    {
        _context = context;
    }

    public async Task<List<NotificationResponseDTO>> GetNotificationsAsync(string? userId, string? userRole)
    {
        List<NotificationEntityClass> entities = await _context.Notifications
            .AsNoTracking()
            .Where(n => !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        // If userRole is provided, filter notifications targeting that role or all roles
        if (!string.IsNullOrWhiteSpace(userRole))
        {
            entities = entities
                .Where(n => n.TargetRoles == null || n.TargetRoles.Count == 0 || n.TargetRoles.Contains(userRole, StringComparer.OrdinalIgnoreCase))
                .ToList();
        }

        return entities.Select(e => MapToDTO(e, userId)).ToList();
    }

    public async Task<NotificationResponseDTO?> MarkAsReadAsync(Guid notificationId, string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return null;

        NotificationEntityClass? entity = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && !n.IsDeleted);

        if (entity == null)
            return null;

        if (!entity.ViewByUsers.Contains(userId))
        {
            entity.ViewByUsers.Add(userId);
            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = userId;
            await _context.SaveChangesAsync();
        }

        return MapToDTO(entity, userId);
    }

    public async Task<int> MarkAllAsReadAsync(string userId, string? userRole)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return 0;

        List<NotificationEntityClass> entities = await _context.Notifications
            .Where(n => !n.IsDeleted)
            .ToListAsync();

        if (!string.IsNullOrWhiteSpace(userRole))
        {
            entities = entities
                .Where(n => n.TargetRoles == null || n.TargetRoles.Count == 0 || n.TargetRoles.Contains(userRole, StringComparer.OrdinalIgnoreCase))
                .ToList();
        }

        int count = 0;
        foreach (var entity in entities)
        {
            if (!entity.ViewByUsers.Contains(userId))
            {
                entity.ViewByUsers.Add(userId);
                entity.UpdatedAt = DateTime.UtcNow;
                entity.UpdatedBy = userId;
                count++;
            }
        }

        if (count > 0)
        {
            await _context.SaveChangesAsync();
        }

        return count;
    }

    public async Task<NotificationResponseDTO> CreateNotificationAsync(CreateNotificationDTO dto, string createdBy = "system")
    {
        PriorityLevelType priority = PriorityLevelType.MID;
        if (!string.IsNullOrWhiteSpace(dto.PriorityLevel) && Enum.TryParse<PriorityLevelType>(dto.PriorityLevel, true, out var p))
        {
            priority = p;
        }

        NotificationType type = NotificationType.SYSTEM_BROADCAST;
        if (!string.IsNullOrWhiteSpace(dto.Type) && Enum.TryParse<NotificationType>(dto.Type, true, out var t))
        {
            type = t;
        }

        string packagedDataString = "{}";
        if (dto.PackagedData != null)
        {
            packagedDataString = dto.PackagedData is string str
                ? str
                : JsonSerializer.Serialize(dto.PackagedData);
        }

        var entity = new NotificationEntityClass
        {
            Id = Guid.NewGuid(),
            Heading = dto.Heading,
            Description = dto.Description,
            Icon = string.IsNullOrWhiteSpace(dto.Icon) ? "Bell" : dto.Icon,
            PriorityLevel = priority,
            Type = type,
            PackagedData = packagedDataString,
            Action = dto.Action != null
                ? new NotificationActionClass { Kind = dto.Action.Kind, Direction = dto.Action.Direction }
                : new NotificationActionClass { Kind = "OPEN_PAGE", Direction = "requests" },
            TargetRoles = dto.TargetRoles ?? new List<string> { "OPERATOR", "ADMIN" },
            ViewByUsers = new List<string>(),
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        await _context.Notifications.AddAsync(entity);
        await _context.SaveChangesAsync();

        return MapToDTO(entity, null);
    }

    public async Task<NotificationResponseDTO> DispatchNotificationAsync(
        string heading,
        string description,
        string icon,
        PriorityLevelType priority,
        NotificationType type,
        object? packagedData = null,
        NotificationActionClass? action = null,
        List<string>? targetRoles = null,
        string createdBy = "system")
    {
        string packagedDataString = "{}";
        if (packagedData != null)
        {
            packagedDataString = packagedData is string str
                ? str
                : JsonSerializer.Serialize(packagedData);
        }

        var entity = new NotificationEntityClass
        {
            Id = Guid.NewGuid(),
            Heading = heading,
            Description = description,
            Icon = string.IsNullOrWhiteSpace(icon) ? "Bell" : icon,
            PriorityLevel = priority,
            Type = type,
            PackagedData = packagedDataString,
            Action = action ?? new NotificationActionClass { Kind = "OPEN_PAGE", Direction = "requests" },
            TargetRoles = targetRoles ?? new List<string> { "OPERATOR", "ADMIN" },
            ViewByUsers = new List<string>(),
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        await _context.Notifications.AddAsync(entity);
        await _context.SaveChangesAsync();

        return MapToDTO(entity, null);
    }

    private static NotificationResponseDTO MapToDTO(NotificationEntityClass entity, string? currentUserId)
    {
        bool isRead = !string.IsNullOrEmpty(currentUserId) && entity.ViewByUsers.Contains(currentUserId);

        object? parsedData = null;
        if (!string.IsNullOrWhiteSpace(entity.PackagedData))
        {
            try
            {
                parsedData = JsonSerializer.Deserialize<JsonElement>(entity.PackagedData);
            }
            catch
            {
                parsedData = entity.PackagedData;
            }
        }

        return new NotificationResponseDTO
        {
            Id = entity.Id,
            Heading = entity.Heading,
            Description = entity.Description,
            Icon = entity.Icon,
            PriorityLevel = entity.PriorityLevel.ToString(),
            Type = entity.Type.ToString(),
            CreatedAt = entity.CreatedAt,
            IsRead = isRead,
            ViewByUsers = entity.ViewByUsers ?? new List<string>(),
            PackagedData = parsedData,
            Action = entity.Action != null
                ? new NotificationActionDTO { Kind = entity.Action.Kind, Direction = entity.Action.Direction }
                : new NotificationActionDTO { Kind = "OPEN_PAGE", Direction = "requests" },
            TargetRoles = entity.TargetRoles ?? new List<string>()
        };
    }
}
