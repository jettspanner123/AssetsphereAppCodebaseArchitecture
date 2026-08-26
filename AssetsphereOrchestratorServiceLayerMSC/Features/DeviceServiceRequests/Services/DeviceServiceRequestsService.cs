using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Features.Notifications.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.DeviceServiceRequests.Services;

public sealed class DeviceServiceRequestsService : IDeviceServiceRequestsService
{
    private readonly AssetsphereDbContext _context;
    private readonly INotificationsService _notificationsService;

    public DeviceServiceRequestsService(
        AssetsphereDbContext context,
        INotificationsService notificationsService)
    {
        _context = context;
        _notificationsService = notificationsService;
    }

    public async Task<List<DeviceServiceRequestResponseDTO>> GetAllRequestsAsync(
        string? currentUserId,
        string? currentUserRole,
        string? status = null)
    {
        IQueryable<DeviceServiceRequestEntityClass> query = _context.DeviceServiceRequests
            .AsNoTracking()
            .Where(r => !r.IsDeleted);

        // If user role is standard USER, restrict to their own requests
        if (string.Equals(currentUserRole, "USER", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.TargetUserId == currentUserId || r.RequesterUserId == currentUserId);
        }

        if (!string.IsNullOrWhiteSpace(status) && !string.Equals(status, "ALL", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.Status.ToUpper() == status.ToUpper());
        }

        List<DeviceServiceRequestEntityClass> entities = await query
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return entities.Select(MapToDTO).ToList();
    }

    public async Task<List<DeviceServiceRequestResponseDTO>> GetMyRequestsAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return new List<DeviceServiceRequestResponseDTO>();

        List<DeviceServiceRequestEntityClass> entities = await _context.DeviceServiceRequests
            .AsNoTracking()
            .Where(r => !r.IsDeleted && (r.TargetUserId == userId || r.RequesterUserId == userId))
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return entities.Select(MapToDTO).ToList();
    }

    public async Task<DeviceServiceRequestResponseDTO?> GetRequestByIdAsync(Guid id)
    {
        DeviceServiceRequestEntityClass? entity = await _context.DeviceServiceRequests
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        return entity == null ? null : MapToDTO(entity);
    }

    public async Task<DeviceServiceRequestResponseDTO> CreateRequestAsync(
        CreateDeviceServiceRequestDTO dto,
        string requesterUserId,
        string requesterName,
        string requesterEmail,
        string requesterRole)
    {
        // Resolve Target User
        bool isOperatorOrHigher = !string.Equals(requesterRole, "USER", StringComparison.OrdinalIgnoreCase);

        string effectiveTargetId = requesterUserId;
        string effectiveTargetName = requesterName;
        string effectiveTargetEmail = requesterEmail;

        if (isOperatorOrHigher && !string.IsNullOrWhiteSpace(dto.TargetUserId))
        {
            effectiveTargetId = dto.TargetUserId;
            effectiveTargetName = !string.IsNullOrWhiteSpace(dto.TargetUserName) ? dto.TargetUserName : requesterName;
            effectiveTargetEmail = !string.IsNullOrWhiteSpace(dto.TargetUserEmail) ? dto.TargetUserEmail : requesterEmail;
        }

        // Generate unique Request Number
        int currentCount = await _context.DeviceServiceRequests.CountAsync();
        string requestNumber = $"SR-{DateTime.UtcNow.Year}-{1001 + currentCount}";

        var entity = new DeviceServiceRequestEntityClass
        {
            Id = Guid.NewGuid(),
            RequestNumber = requestNumber,
            RequesterUserId = requesterUserId,
            RequesterName = requesterName,
            RequesterEmail = requesterEmail,
            RequesterRole = requesterRole,
            TargetUserId = effectiveTargetId,
            TargetUserName = effectiveTargetName,
            TargetUserEmail = effectiveTargetEmail,
            AssetId = dto.AssetId,
            AssetTag = string.IsNullOrWhiteSpace(dto.AssetTag) ? "UNASSIGNED" : dto.AssetTag,
            AssetName = string.IsNullOrWhiteSpace(dto.AssetName) ? "Custom Device" : dto.AssetName,
            ServiceCategory = dto.ServiceCategory,
            ComponentSubtype = dto.ComponentSubtype,
            UsabilityState = dto.UsabilityState,
            ServiceChannel = dto.ServiceChannel,
            Urgency = string.IsNullOrWhiteSpace(dto.Urgency) ? "MEDIUM" : dto.Urgency.ToUpper(),
            WorkLocation = dto.WorkLocation,
            DescriptionRichText = dto.DescriptionRichText,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = requesterEmail
        };

        await _context.DeviceServiceRequests.AddAsync(entity);
        await _context.SaveChangesAsync();

        // Dispatch operational notification to Operators/Admins
        try
        {
            PriorityLevelType priority = entity.Urgency switch
            {
                "CRITICAL" => PriorityLevelType.HIGH,
                "HIGH" => PriorityLevelType.HIGH,
                "LOW" => PriorityLevelType.LOW,
                _ => PriorityLevelType.MID
            };

            await _notificationsService.DispatchNotificationAsync(
                heading: $"Device Service Request: {entity.RequestNumber}",
                description: $"{entity.RequesterName} submitted a {entity.ServiceCategory} request for {entity.AssetName} ({entity.AssetTag}) - Urgency: {entity.Urgency}.",
                icon: "Wrench",
                priority: priority,
                type: NotificationType.MAINTENANCE_DUE,
                packagedData: new
                {
                    requestId = entity.Id,
                    requestNumber = entity.RequestNumber,
                    assetTag = entity.AssetTag,
                    assetName = entity.AssetName,
                    serviceCategory = entity.ServiceCategory,
                    urgency = entity.Urgency,
                    requester = entity.RequesterName
                },
                action: new NotificationActionClass
                {
                    Kind = "OPEN_PAGE",
                    Direction = "device_service_requests"
                },
                targetRoles: new List<string> { "OPERATOR", "ADMIN", "DEVELOPER" },
                createdBy: requesterEmail
            );
        }
        catch
        {
            // Non-blocking notification dispatch
        }

        return MapToDTO(entity);
    }

    public async Task<DeviceServiceRequestResponseDTO?> UpdateRequestStatusAsync(
        Guid id,
        UpdateDeviceServiceRequestStatusDTO dto,
        string updatedBy)
    {
        DeviceServiceRequestEntityClass? entity = await _context.DeviceServiceRequests
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (entity == null)
            return null;

        if (!string.IsNullOrWhiteSpace(dto.Status))
        {
            entity.Status = dto.Status.ToUpper();
        }

        if (dto.ResolutionNotes != null)
        {
            entity.ResolutionNotes = dto.ResolutionNotes;
        }

        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = updatedBy;

        await _context.SaveChangesAsync();

        return MapToDTO(entity);
    }

    private static DeviceServiceRequestResponseDTO MapToDTO(DeviceServiceRequestEntityClass entity)
    {
        return new DeviceServiceRequestResponseDTO
        {
            Id = entity.Id,
            RequestNumber = entity.RequestNumber,
            RequesterUserId = entity.RequesterUserId,
            RequesterName = entity.RequesterName,
            RequesterEmail = entity.RequesterEmail,
            RequesterRole = entity.RequesterRole,
            TargetUserId = entity.TargetUserId,
            TargetUserName = entity.TargetUserName,
            TargetUserEmail = entity.TargetUserEmail,
            AssetId = entity.AssetId,
            AssetTag = entity.AssetTag,
            AssetName = entity.AssetName,
            ServiceCategory = entity.ServiceCategory,
            ComponentSubtype = entity.ComponentSubtype,
            UsabilityState = entity.UsabilityState,
            ServiceChannel = entity.ServiceChannel,
            Urgency = entity.Urgency,
            WorkLocation = entity.WorkLocation,
            DescriptionRichText = entity.DescriptionRichText,
            Status = entity.Status,
            ResolutionNotes = entity.ResolutionNotes,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            CreatedBy = entity.CreatedBy,
            UpdatedBy = entity.UpdatedBy
        };
    }
}
